import { intenralReactPropsKey, internalInstanceKey } from "../dom/client/ReactDOMRoot";
import { createWorkInProgress } from "./Fiber";
import { beginWork } from "./fiberBeginwork";
import { commitPlacement } from "./FiberCommitWork"
import { Deletion, Placement, PlacementAndUpdate, Update } from "./FiberFlags"
import { ClassComponent, HostComponent, HostRoot, HostText } from "./WorkTags";

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

  const current = workInProgress.alternate
  const next = beginWork(current, unitOfWork)

  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {
    completeUnitOfWork(unitOfWork)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(unitOfWork)  {
  let completedWork = unitOfWork
  // 自下而上构建
  while (completedWork !== null) {
    const current = completedWork.alternate
    const returnFiber = completedWork.return
    completWork(current, completedWork)
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return 
    }

    // The last sibling
    completedWork = returnFiber
    workInProgress = returnFiber
  }
}

function completWork(current, workInProgress) {
  const {pendingProps, type} = workInProgress

  switch(workInProgress.tag) {
    case HostRoot: {
      const {containerInfo} = workInProgress.stateNode
      appendChild(containerInfo, workInProgress.child)
      return null;
    }
    case ClassComponent: {
      return null
    }
    case HostComponent: {
      const instance = createInstance(type,workInProgress.pendingProps, workInProgress)
      workInProgress.stateNode = instance
      appendChild(instance, workInProgress.child)
      return null
    }
    case HostText: {
      const text = document.createTextNode(pendingProps + '')
      workInProgress.stateNode = text
      return null
    }
  }
}

function appendChild(parentInstance, firstChild) {
      let node = firstChild
      while (node !== null) {
        parentInstance.appendChild(node.stateNode)
        node = node.sibling
      }
}


function prepareFreshStack(root) {
  root.finishedWork = null

  workInProgressRoot = root
  workInProgress = createWorkInProgress(root.current)
  workInProgressRootExitStatus = RootIncomplete
}

function createInstance(
  type,
  props,
  internalInstanceHandle
) {

  const instance = document.createElement(type)

  // update internal props
  instance[intenralReactPropsKey] = props
  instance[internalInstanceKey] = internalInstanceHandle
  return instance
}