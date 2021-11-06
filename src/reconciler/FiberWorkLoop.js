import { commitPlacement } from "./FiberCommitWork"
import { Deletion, Placement, PlacementAndUpdate, Update } from "./FiberFlags"

let nextEffect = null


function commitMutationEffects(
  root
) {



  while(nextEffect !== null) {

    const primaryFlags = flags & (Placement | Update | Deletion)
    switch(primaryFlags) {
      case Placement: {
        commitPlacement(nextEffect)
        nextEffect.flags &= ~Placement
        break
      }
      case PlacementAndUpdate: {
        commitPlacement(nextEffect)
        nextEffect.flags &= ~Placement

        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Update: {
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
      }
      case Deletion: {
        commitDeletion(root, nextEffect)
        break
      }
    }

    nextEffect = nextEffect.nextEffect
  }
}