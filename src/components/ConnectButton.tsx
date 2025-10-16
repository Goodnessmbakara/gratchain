import { useConnect } from 'wagmi'
import { Wallet, Loader2 } from 'lucide-react'

export function ConnectButton() {
  const { connectors, connect, isPending } = useConnect()

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white font-medium transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Connect with ${connector.name}`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          <span className="text-sm">
            {isPending ? 'Connecting...' : `Connect ${connector.name}`}
          </span>
        </button>
      ))}
    </div>
  )
}

