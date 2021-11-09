import { createWorkInProgress } from "./Fiber";
import { beginWork } from "./fiberBeginwork";
import { commitPlacement } from "./FiberCommitWork"
import { Deletion, Placement, PlacementAndUpdate, Update } from "./FiberFlags"

const RootIncomplete = 0;
const RootCompleted = 5;

let workInProgress = null
let workInProgressRoot = null
let workInProgressRootExitStatus = RootIncomplete

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

export function scheduleUpdateOnFiber(
  fiber
) {
  performSyncWorkOnRoot(fiber.stateNode)
}


function performSyncWorkOnRoot(root) {
  renderRootSync(root)
  //AcommitRoot(root)
}

function renderRootSync(root) {
  if (workInProgressRoot !== root) {
    // Mount
    prepareFreshStack(root)
  }
  workLoopSync()
}

function workLoopSync() {
  while(workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(unitOfWork) {

  console.log(unitOfWork)
  const current = workInProgress.alternate
  const next = beginWork(current, unitOfWork)

  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }
  workInProgress = null
}

function completeUnitOfWork(unitOfWork)  {
}


function prepareFreshStack(root) {
  root.finishedWork = null

  workInProgressRoot = root
  workInProgress = createWorkInProgress(root.current)
  workInProgressRootExitStatus = RootIncomplete
}