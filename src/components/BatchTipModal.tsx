import { useState, useEffect } from 'react'
import { Creator } from '../types'
import { useSpendPermissions } from '../hooks/useSpendPermissions'
import { X, Plus, Minus, Lightning } from 'phosphor-react'
import toast from 'react-hot-toast'

interface BatchTipModalProps {
  isOpen: boolean
  onClose: () => void
  creators: Creator[]
}

interface BatchTipItem {
  creator: Creator
  amount: string
  selected: boolean
}

export function BatchTipModal({ isOpen, onClose, creators }: BatchTipModalProps) {
  const [batchItems, setBatchItems] = useState<BatchTipItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { sendTip, isLoading: spendPermissionLoading } = useSpendPermissions()

  // Initialize batch items when modal opens
  useEffect(() => {
    if (isOpen) {
      const items = creators.map(creator => ({
        creator,
        amount: '0.001',
        selected: false
      }))
      setBatchItems(items)
    }
  }, [isOpen, creators])

  const toggleCreator = (creatorId: string) => {
    setBatchItems(prev => prev.map(item => 
      item.creator.id === creatorId 
        ? { ...item, selected: !item.selected }
        : item
    ))
  }

  const updateAmount = (creatorId: string, amount: string) => {
    setBatchItems(prev => prev.map(item => 
      item.creator.id === creatorId 
        ? { ...item, amount }
        : item
    ))
  }

  const selectAll = () => {
    setBatchItems(prev => prev.map(item => ({ ...item, selected: true })))
  }

  const deselectAll = () => {
    setBatchItems(prev => prev.map(item => ({ ...item, selected: false })))
  }

  const selectedItems = batchItems.filter(item => item.selected)
  const totalAmount = selectedItems.reduce((sum, item) => sum + parseFloat(item.amount), 0)

  const handleBatchTip = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one creator to tip')
      return
    }

    setIsProcessing(true)

    try {
      // Process tips sequentially to avoid rate limiting
      for (const item of selectedItems) {
        try {
          await sendTip(item.creator.walletAddress, item.amount)
          toast.success(`Tipped ${item.creator.name} ${item.amount} ETH`)
        } catch (error) {
          toast.error(`Failed to tip ${item.creator.name}`)
          console.error(`Tip error for ${item.creator.name}:`, error)
        }
      }

      toast.success(`Batch tip completed! Tipped ${selectedItems.length} creators`)
      onClose()
    } catch (error) {
      toast.error('Batch tipping failed. Please try again.')
      console.error('Batch tip error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Lightning className="w-5 h-5 text-white" weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Batch Tipping</h2>
              <p className="text-white/70 text-sm">Tip multiple creators at once</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Quick Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white text-sm transition-all duration-300"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white text-sm transition-all duration-300"
            >
              Deselect All
            </button>
          </div>

          {/* Creator List */}
          <div className="space-y-3">
            {batchItems.map((item) => (
              <div
                key={item.creator.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  item.selected
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleCreator(item.creator.id)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{item.creator.name}</h3>
                    <p className="text-white/70 text-sm truncate">@{item.creator.username}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateAmount(item.creator.id, Math.max(0, parseFloat(item.amount) - 0.001).toFixed(3))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateAmount(item.creator.id, e.target.value)}
                        step="0.001"
                        min="0"
                        max="1"
                        className="w-20 px-2 py-1 bg-white/5 border border-white/20 rounded text-white text-sm text-center focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-white/70 text-sm">ETH</span>
                    </div>
                    
                    <button
                      onClick={() => updateAmount(item.creator.id, (parseFloat(item.amount) + 0.001).toFixed(3))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm">Selected: {selectedItems.length} creators</p>
              <p className="text-emerald-400 font-semibold">Total: {totalAmount.toFixed(3)} ETH</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleBatchTip}
              disabled={selectedItems.length === 0 || isProcessing || spendPermissionLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lightning className="w-4 h-4" weight="duotone" />
                  Send Batch Tip
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
