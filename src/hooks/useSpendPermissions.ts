import { useState, useEffect, useCallback } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { createBaseAccountSDK } from '@base-org/account'
import { parseEther } from 'viem'

interface SpendPermission {
  id: string
  amount: string
  recipient: string
  token: string
  expiresAt?: number
  isActive: boolean
}

interface SpendPermissionState {
  permissions: SpendPermission[]
  isLoading: boolean
  error: string | null
  createPermission: (amount: string, recipient: string) => Promise<void>
  revokePermission: (id: string) => Promise<void>
  sendTip: (recipient: string, amount: string) => Promise<void>
  hasActivePermissions: boolean
}

export function useSpendPermissions(): SpendPermissionState {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [permissions, setPermissions] = useState<SpendPermission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Base Account SDK
  const [sdk, setSdk] = useState<any>(null)

  useEffect(() => {
    if (isConnected && address && chainId === 8453) { // Base mainnet
      try {
        const baseSDK = createBaseAccountSDK({
          appName: 'GratChain',
          appChainIds: [8453],
          subAccounts: {
            creation: 'on-connect',
            defaultAccount: 'sub',
            funding: 'spend-permissions',
            toOwnerAccount: async () => ({ account: address as any })
          }
        })
        setSdk(baseSDK)
      } catch (err) {
        console.error('Failed to initialize Base Account SDK:', err)
        setError('Failed to initialize Base Account SDK')
      }
    }
  }, [isConnected, address, chainId])

  const createPermission = useCallback(async (amount: string, recipient: string) => {
    if (!sdk || !address) {
      setError('SDK not initialized or wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create spend permission for tipping
      const permission = await sdk.spendPermissions.create({
        amount: parseEther(amount),
        recipient,
        token: 'native', // ETH
        description: `Auto-tip permission for ${recipient}`,
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      })

      const newPermission: SpendPermission = {
        id: permission.id,
        amount,
        recipient,
        token: 'native',
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
        isActive: true
      }

      setPermissions(prev => [...prev, newPermission])
    } catch (err) {
      console.error('Failed to create spend permission:', err)
      setError('Failed to create spend permission')
    } finally {
      setIsLoading(false)
    }
  }, [sdk, address])

  const revokePermission = useCallback(async (id: string) => {
    if (!sdk) {
      setError('SDK not initialized')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await sdk.spendPermissions.revoke(id)
      setPermissions(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('Failed to revoke spend permission:', err)
      setError('Failed to revoke spend permission')
    } finally {
      setIsLoading(false)
    }
  }, [sdk])

  const sendTip = useCallback(async (recipient: string, amount: string) => {
    if (!sdk || !address) {
      setError('SDK not initialized or wallet not connected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Check if we have an active spend permission for this recipient
      const existingPermission = permissions.find(
        p => p.recipient.toLowerCase() === recipient.toLowerCase() && p.isActive
      )

      if (existingPermission) {
        // Use existing spend permission for seamless tipping
        await sdk.spendPermissions.execute(existingPermission.id, {
          amount: parseEther(amount),
          recipient
        })
      } else {
        // Create new permission and execute tip
        await createPermission(amount, recipient)
        // The permission creation will handle the tip execution
      }
    } catch (err) {
      console.error('Failed to send tip:', err)
      setError('Failed to send tip')
      throw err // Re-throw for component error handling
    } finally {
      setIsLoading(false)
    }
  }, [sdk, address, permissions, createPermission])

  const hasActivePermissions = permissions.some(p => p.isActive)

  return {
    permissions,
    isLoading,
    error,
    createPermission,
    revokePermission,
    sendTip,
    hasActivePermissions
  }
}
