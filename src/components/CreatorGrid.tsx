import { Creator } from '../types'
import { CreatorCard } from './CreatorCard'

interface CreatorGridProps {
  creators: Creator[]
  onTipCreator?: (creator: Creator) => void
  loadingCreatorId?: string | null
}

export function CreatorGrid({ creators, onTipCreator, loadingCreatorId }: CreatorGridProps) {
  if (creators.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/70 text-lg">No creators found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onTip={onTipCreator}
          isLoading={loadingCreatorId === creator.id}
        />
      ))}
    </div>
  )
}

