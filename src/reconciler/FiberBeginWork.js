import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { cloneUpdateQueue, processUpdateQueue } from "./UpdateQueue";
import { HostRoot } from "./WorkTags";

let didReceiveUpdate = false

export function beginWork(
  current,
  workInProgress
) {

  if (current !== null) {

  } else {
    didReceiveUpdate = false
  }

  switch(workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress)
  }
}


function updateHostRoot(current, workInProgress) {
  //console.log('updateHostRoot')
  const updateQueue = workInProgress.updateQueue
  const nextProps = workInProgress.pendingProps
  const prevState = workInProgress.memoizedState
  const prevChildren = prevState !== null ? prevState.element : null
  cloneUpdateQueue(current, workInProgress)
  processUpdateQueue(workInProgress, nextProps, null)

  const nextState = workInProgress.memoizedState
  const nextChildren = nextState.element

  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}

export function reconcileChildren(
  current,
  workInProgress,
  nextChildren
) {
  if (current === null) {
    // mount, nextChildren -> child Fiber -> workInProgress
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
  } else  {
    // update
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current,
      nextChildren
    )
  }
}
