// import { useAccount, useSwitchChain } from 'wagmi'
// import { AlertCircle } from 'lucide-react'
// import { baseSepolia } from '../config/wagmi'

// interface NetworkGuardProps {
//   children: React.ReactNode
// }

// export function NetworkGuard({ children }: NetworkGuardProps) {
//   const { chain, isConnected } = useAccount()
//   const { switchChain, isPending } = useSwitchChain()

//   // If not connected, show children (they'll see connect button)
//   if (!isConnected) {
//     return <>{children}</>
//   }

//   // Check if on wrong network
//   const isWrongNetwork = chain && chain.id !== baseSepolia.id

//   if (isWrongNetwork) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center">
//           <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-yellow-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">Wrong Network</h2>
//           <p className="text-white/80 mb-6">
//             Please switch to <span className="font-semibold text-white">{targetChain.name}</span> to use GratChain.
//           </p>
//           <button
//             onClick={() => switchChain({ chainId: targetChain.id })}
//             disabled={isPending}
//             className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isPending ? 'Switching...' : `Switch to ${targetChain.name}`}
//           </button>
//           <p className="text-xs text-white/60 mt-4">
//             Current network: {chain?.name || 'Unknown'}
//           </p>
//         </div>
//       </div>
//     )
//   }

//   return <>{children}</>
// }

