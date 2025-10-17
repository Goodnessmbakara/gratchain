// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title GratChain
 * @author
 * @notice On-chain tipping jar for creators. Supports:
 *    - Native ETH tips (single and batch)
 *    - ERC-20 token tips
 *    - Creator self-registration with metadata (username/handle)
 *    - Withdrawals by creators
 *    - Events so off-chain indexers/frontends can read tip history
 *
 * Security:
 *  - Uses ReentrancyGuard for withdrawals
 *  - Validates inputs, prevents zero-value tips
 *  - Uses SafeERC20 for ERC-20 token transfers
 *
 * Integration notes:
 *  - This contract is wallet-agnostic. Base Sub Accounts / Auto Spend features are handled client-side
 *    by the SDK — subaccounts will simply call these contract functions.
 *  - The frontend should show permission/limit UI before letting subaccounts send tips.
 */

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GratChain is ReentrancyGuard, Pausable, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Minimum tip allowed (in wei). Prevents spam or zero tipping.
    uint256 public minTipWei = 1e13; // default 0.00001 ETH (adjustable by owner)

    /// @notice Representation for native token (ETH). Use address(0) for native.
    address public constant NATIVE = address(0);

    /// @notice Creator profile structure
    struct Creator {
        address wallet;
        string handle;      // e.g. "alice.eth" or "@alice"
        string metadataURI; // optional JSON or IPFS link describing the creator
        bool exists;
    }

    /// @notice Map creator wallet address to Creator
    mapping(address => Creator) public creators;

    /// @notice Balance ledger for native ETH tips per creator
    mapping(address => uint256) public nativeBalances;

    /// @notice ERC20 token balances per token per creator: token => creator => amount
    mapping(address => mapping(address => uint256)) public erc20Balances;

    /// @notice Events
    event CreatorRegistered(address indexed creator, string handle, string metadataURI);
    event TipNative(address indexed from, address indexed toCreator, uint256 amountWei, bytes32 indexed noteHash);
    event TipERC20(address indexed from, address indexed toCreator, address indexed token, uint256 amount);
    event WithdrawNative(address indexed creator, uint256 amountWei, address indexed to);
    event WithdrawERC20(address indexed creator, address indexed token, uint256 amount, address indexed to);
    event MinTipUpdated(uint256 oldMin, uint256 newMin);

    // Optional: useful noteHash for attaching an off-chain note ID (e.g., IPFS hash or message id)
    // If not needed, frontend can pass bytes32(0).

    /// -----------------------------------------------------------------------
    /// Constructor
    /// -----------------------------------------------------------------------
    constructor(uint256 _minTipWei) {
        if (_minTipWei > 0) {
            minTipWei = _minTipWei;
        }
    }

    /// -----------------------------------------------------------------------
    /// Creator registration
    /// -----------------------------------------------------------------------

    /**
     * @notice Register as a creator (self-registration).
     * @param _handle Display username/handle.
     * @param _metadataURI Optional metadata URI (IPFS/JSON).
     */
    function registerCreator(string calldata _handle, string calldata _metadataURI) external whenNotPaused {
        require(bytes(_handle).length > 0, "handle-required");
        Creator storage c = creators[msg.sender];
        c.wallet = msg.sender;
        c.handle = _handle;
        c.metadataURI = _metadataURI;
        c.exists = true;

        emit CreatorRegistered(msg.sender, _handle, _metadataURI);
    }

    /**
     * @notice Owner can register a creator on behalf of another wallet (admin flow).
     *         Useful for bootstrapping the creator list or emergency onboarding.
     * @param _creator The wallet address of the creator.
     * @param _handle Username/handle.
     * @param _metadataURI Optional metadata URI.
     */
    function adminRegisterCreator(address _creator, string calldata _handle, string calldata _metadataURI) external onlyOwner {
        require(_creator != address(0), "invalid-creator");
        require(bytes(_handle).length > 0, "handle-required");
        Creator storage c = creators[_creator];
        c.wallet = _creator;
        c.handle = _handle;
        c.metadataURI = _metadataURI;
        c.exists = true;

        emit CreatorRegistered(_creator, _handle, _metadataURI);
    }

    /// -----------------------------------------------------------------------
    /// Tips (native ETH)
    /// -----------------------------------------------------------------------

    /**
     * @notice Tip a single creator with native ETH.
     * @dev msg.value must be >= minTipWei
     * @param _toCreator the creator wallet address
     * @param _noteHash optional note id (e.g., keccak of a message or ipfs hash) for indexing
     */
    function tipNative(address _toCreator, bytes32 _noteHash) external payable whenNotPaused {
        require(_toCreator != address(0), "invalid-creator");
        require(msg.value >= minTipWei, "tip-too-small");
        require(creators[_toCreator].exists, "creator-not-registered");

        // credit creator balance; do not forward ETH directly to avoid reentrancy or gas grief
        nativeBalances[_toCreator] += msg.value;

        emit TipNative(msg.sender, _toCreator, msg.value, _noteHash);
    }

    /**
     * @notice Tip multiple creators in one tx by specifying explicit amounts per creator.
     *         The sum of amounts must equal msg.value.
     * @param _toCreators array of recipient creator addresses
     * @param _amounts array of amounts in wei per recipient; must align with _toCreators
     * @param _noteHash optional note id to attach to every emitted TipNative
     */
    function tipMultipleExplicit(address[] calldata _toCreators, uint256[] calldata _amounts, bytes32 _noteHash) external payable whenNotPaused {
        uint256 n = _toCreators.length;
        require(n == _amounts.length && n > 0, "mismatch-or-empty");

        uint256 sum = 0;
        for (uint256 i = 0; i < n; ++i) {
            require(_toCreators[i] != address(0), "invalid-creator");
            require(_amounts[i] >= minTipWei, "tip-too-small");
            require(creators[_toCreators[i]].exists, "creator-not-registered");
            sum += _amounts[i];
        }
        require(sum == msg.value, "value-mismatch");

        for (uint256 i = 0; i < n; ++i) {
            address to = _toCreators[i];
            uint256 amt = _amounts[i];
            nativeBalances[to] += amt;
            emit TipNative(msg.sender, to, amt, _noteHash);
        }
    }

    /**
     * @notice Tip multiple creators and split msg.value equally among them.
     *         Any remainder (msg.value % count) goes to the last creator.
     * @param _toCreators array of creator recipients
     * @param _noteHash optional note id
     */
    function tipMultipleSplit(address[] calldata _toCreators, bytes32 _noteHash) external payable whenNotPaused {
        uint256 n = _toCreators.length;
        require(n > 0, "empty-list");
        uint256 per = msg.value / n;
        require(per >= minTipWei, "tip-too-small-each");
        uint256 remainder = msg.value % n;

        for (uint256 i = 0; i < n; ++i) {
            address to = _toCreators[i];
            require(to != address(0), "invalid-creator");
            require(creators[to].exists, "creator-not-registered");
            uint256 amt = per;
            // last recipient gets remainder
            if (i == n - 1) {
                amt += remainder;
            }
            nativeBalances[to] += amt;
            emit TipNative(msg.sender, to, amt, _noteHash);
        }
    }

    /// -----------------------------------------------------------------------
    /// Tips (ERC-20)
    /// -----------------------------------------------------------------------

    /**
     * @notice Tip a creator using an ERC-20 token.
     * @param _token ERC-20 token contract address.
     * @param _toCreator Creator wallet address.
     * @param _amount token amount in token's smallest unit (e.g., wei for ERC20).
     */
    function tipERC20(address _token, address _toCreator, uint256 _amount) external whenNotPaused {
        require(_token != address(0), "invalid-token");
        require(_toCreator != address(0), "invalid-creator");
        require(_amount > 0, "amount-zero");
        require(creators[_toCreator].exists, "creator-not-registered");

        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        erc20Balances[_token][_toCreator] += _amount;

        emit TipERC20(msg.sender, _toCreator, _token, _amount);
    }

    /**
     * @notice Tip multiple recipients using ERC-20 token with explicit amounts.
     *         Caller must have approved this contract for sum(amounts).
     * @param _token ERC-20 token address
     * @param _toCreators list of creators
     * @param _amounts list of amounts per creator (same length)
     */
    function tipERC20MultipleExplicit(address _token, address[] calldata _toCreators, uint256[] calldata _amounts) external whenNotPaused {
        require(_token != address(0), "invalid-token");
        uint256 n = _toCreators.length;
        require(n == _amounts.length && n > 0, "mismatch-or-empty");

        uint256 total = 0;
        for (uint256 i = 0; i < n; ++i) {
            require(_toCreators[i] != address(0), "invalid-creator");
            require(creators[_toCreators[i]].exists, "creator-not-registered");
            require(_amounts[i] > 0, "amount-zero");
            total += _amounts[i];
        }

        // pull total tokens from sender once
        IERC20(_token).safeTransferFrom(msg.sender, address(this), total);

        // distribute in ledger
        for (uint256 i = 0; i < n; ++i) {
            erc20Balances[_token][_toCreators[i]] += _amounts[i];
            emit TipERC20(msg.sender, _toCreators[i], _token, _amounts[i]);
        }
    }

    /// -----------------------------------------------------------------------
    /// Withdrawals (Creators withdraw their balances)
    /// -----------------------------------------------------------------------

    /**
     * @notice Withdraw accumulated native ETH for the caller (creator).
     * @param _to address to send withdrawn funds to (useful to send to different wallet)
     */
    function withdrawNative(address payable _to) external nonReentrant whenNotPaused {
        require(_to != address(0), "invalid-to");
        uint256 bal = nativeBalances[msg.sender];
        require(bal > 0, "no-balance");

        // zero first to avoid reentrancy
        nativeBalances[msg.sender] = 0;

        // transfer
        (bool ok, ) = _to.call{value: bal}("");
        require(ok, "native-transfer-failed");

        emit WithdrawNative(msg.sender, bal, _to);
    }

    /**
     * @notice Withdraw accumulated ERC-20 tokens for the caller (creator).
     * @param _token token address
     * @param _to recipient address
     */
    function withdrawERC20(address _token, address _to) external nonReentrant whenNotPaused {
        require(_token != address(0), "invalid-token");
        require(_to != address(0), "invalid-to");
        uint256 bal = erc20Balances[_token][msg.sender];
        require(bal > 0, "no-balance");

        erc20Balances[_token][msg.sender] = 0;
        IERC20(_token).safeTransfer(_to, bal);

        emit WithdrawERC20(msg.sender, _token, bal, _to);
    }

    /// -----------------------------------------------------------------------
    /// Admin / Owner functions
    /// -----------------------------------------------------------------------

    /**
     * @notice Update minimum tip wei allowed. Owner only.
     * @param _newMin new minimum in wei
     */
    function setMinTipWei(uint256 _newMin) external onlyOwner {
        emit MinTipUpdated(minTipWei, _newMin);
        minTipWei = _newMin;
    }

    /**
     * @notice Emergency: owner can pause contract (stops tipping/withdrawals)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Owner unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Admin emergency withdrawal of tokens or native funds left in contract (for recovery/maintenance).
     * @dev Use carefully. Prefer to avoid using unless a bug exists. Owner only.
     */
    function adminWithdrawERC20(address _token, address _to, uint256 _amount) external onlyOwner nonReentrant {
        require(_token != address(0), "invalid-token");
        require(_to != address(0), "invalid-to");
        IERC20(_token).safeTransfer(_to, _amount);
    }

    function adminWithdrawNative(address payable _to, uint256 _amount) external onlyOwner nonReentrant {
        require(_to != address(0), "invalid-to");
        (bool ok, ) = _to.call{value: _amount}("");
        require(ok, "native-transfer-failed");
    }

    /// -----------------------------------------------------------------------
    /// View helpers
    /// -----------------------------------------------------------------------

    /**
     * @notice Get a creator's info
     */
    function getCreator(address _creator) external view returns (Creator memory) {
        return creators[_creator];
    }

    /**
     * @notice Convenience helper returning ERC-20 balance for a creator+token.
     */
    function getERC20Balance(address _token, address _creator) external view returns (uint256) {
        return erc20Balances[_token][_creator];
    }

    /// -----------------------------------------------------------------------
    /// Fallbacks
    /// -----------------------------------------------------------------------

    // Accept plain ETH transfers; consider treating it as donation to owner or reject.
    receive() external payable {
        // Accept but do nothing: ETH stays in contract. Owner may withdraw via admin if needed.
    }
}

