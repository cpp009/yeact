

const FiberTag = {
  HostRoot: 1,
  HostText: 2,
}


const element = {
  children: [
    {
      type: '1'
    },
    {
      type: 2,
    },
    {
      type: 3,
      children: 'summer'
    }
  ]
}

const ele1 = 'summerTextNode'

const ele2 = [
  'summer',
  'winter',
  'spring',
  'autumn'
]

let workInProgress = {
  alternate: null,
  tag: FiberTag.HostRoot,
  memoizedState: {
    element: ele2
  }
} 

function workLoopSync() {

  while(workInProgress !== null) {
    performUnitWork(workInProgress)
  }
}


function performUnitWork(unitOfWork) {
  const current = unitOfWork.alternate

  const next = beginWork(current, unitOfWork)
  console.log(next)
  workInProgress = next
}


function beginWork(
  current,
  workInProgress
) {

  switch(workInProgress.tag) {
    case FiberTag.HostRoot:
      return updateHostRoot(current, workInProgress)
  }

  return null
}


function updateHostRoot(current, workInProgress) {
  const nextState = workInProgress.memoizedState
  const nextChildren = nextState.element
  reconcileChildren(current, workInProgress, nextChildren)
  return workInProgress.child
}

function reconcileChildren(
  current,
  workInProgress,
  nextChildren
) {

  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren
    )
  } else {
    workInProgress.child = null
  }
}

function mountChildFibers(returnFiber, currentFirstChild, newChild) {


  const isObject = typeof newChild === 'object' && newChild !== null
  console.log(isObject, newChild)

  if (isObject) {

  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        '' + newChild
      )
    )
  }


  if (Array.isArray(newChild)) {
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild
    )
  }


  return null
}

function reconcileChildrenArray(
  returnFiber,
  currentFirstChild,
  newChildren
) {

  let resultingFirstChild = null
  let previousNewFiber = null
  let idx = 0
  for (; idx < newChildren.length; idx ++) {
    const newFiber = createChild(returnFiber, newChildren[idx])
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }
    previousNewFiber = newFiber
  }
  return resultingFirstChild
}

function createChild(
  returnFiber,
  newChild
) {
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    const created = createFiberFromText('' + newChild)
    return created
  }
  return null
}

function placeSingleChild(newFiber) {
  return newFiber
}

function reconcileSingleTextNode(
  returnFiber,
  currentFirstChild,
  textContent
) {

  deleteRemainingChildren(returnFiber, currentFirstChild)
  const created = createFiberFromText(textContent)
  return created
}


function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions
  if (deletions !== null) {
    returnFiber.deletions = [childToDelete]
    returnFiber.flags |= 'Deletion'
  } else {
    deletions.push(childToDelete)
  }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild
  while(childToDelete !== null) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
  return null
}

function createFiberFromText( content) {
  const fiber = creatFiber(FiberTag.HostText, content, null)
  return fiber
}

function creatFiber( tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

function  FiberNode(
  tag,
  pendingProps,
  key
) {

  this.tag = tag
  this.key = key
  this.elementType = null
  this.type = null
  this.stateNode = null

  this.return = null
  this.child = null
  this.sibling = null

  this.pendingProps = pendingProps
  this.memoizedProps = null
  this.updateQueue = null
  this.memoizedState = null

  this.flags = null
  this.deletions = null

  this.alternate = null
}

workLoopSync()