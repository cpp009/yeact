import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { HostRoot } from "./WorkTags";

let didReceiveUpdate = false

export function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren);
  }
}


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
  console.log('updateHostRoot')
  const updateQueue = workInProgress.updateQueue
  const nextProps = workInProgress.pendingProps
  const prevState = workInProgress.memoizedState
  const prevChildren = prevState !== null ? prevState.element : null


}