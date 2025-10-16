import { useConnect } from 'wagmi'
import { Wallet, Loader2 } from 'lucide-react'

export function ConnectButton() {
  const { connectors, connect, isPending } = useConnect()

  // Filter to show only primary connectors for cleaner UI
  const primaryConnectors = connectors.filter(connector => 
    ['coinbaseWallet', 'walletConnect', 'injected'].includes(connector.id)
  )

  return (
    <div className="flex gap-3">
      {primaryConnectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="group flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 text-white/90 font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          aria-label={`Connect with ${connector.name}`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </div>
          )}
          <span className="text-sm font-medium">
            {isPending ? 'Connecting...' : connector.name === 'injected' ? 'MetaMask' : connector.name}
          </span>
        </button>
      ))}
    </div>
  )
}

