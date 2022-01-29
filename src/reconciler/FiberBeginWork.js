import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { cloneUpdateQueue, processUpdateQueue } from "./UpdateQueue";
import { ClassComponent, HostComponent, HostRoot, HostText, IndeterminateComponent } from "./WorkTags";

let didReceiveUpdate = false

export function beginWork(
  current,
  workInProgress
) {

  if (current !== null) {

  } else {
    didReceiveUpdate = false
  }
  console.log(workInProgress, 'jkijiji')

  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return null
    case ClassComponent:
      return updateClassComponent(current, workInProgress, workInProgress.type)
    case HostRoot:
      return updateHostRoot(current, workInProgress)
    case HostComponent:
      return updateHostComponent(current, workInProgress)
    case HostText:
      return updateHostText(current, workInProgress)
  }
  return null
}

function  updateClassComponent(current, workInProgress, Component) {

  const inst = new Component()
  reconcileChildren(current, workInProgress, inst.render())
  return workInProgress.chidl
}


function updateHostText(current, workInProgress) {
  return null;
}

function updateHostComponent(current, workInProgress) {
  const type = workInProgress.type
  const nextProps = workInProgress.pendingProps
  const prevProps = current !== null ? current.memoizedProps : null

  let nextChildren = nextProps.children

  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
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
  } else {
    // update
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current,
      nextChildren
    )
  }
}
