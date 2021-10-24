



// reconcileChildren(current, workInProgress, nextChildren)

function reconcileChildren() {

}



function reconcileChildFibers(
  returnFiber,
  currentFirstChild,
  newChild
) {



  const isObject = typeof newChild === 'object' && newChild !== null


  if (isObject) {
    switch(newChild.$$typeof) {
      case 'REACT_ELEMENT_TYPE':
        return placeSingleChild(
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild
          )
        )
    }
  }


  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        newChild
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

}

function reconcileSingleElement(
  returnFiber,
  currentFirstChild,
  element
) {
  const key = element.key
  const child = currentFirstChild
  while(child !== null) {
    if (child.key === key) {
      if (child.elementType === element.type) {
        deleteRemainingChildren(returnFiber, child.sibling)
        const existing = useFiber(child, element.props)
        existing.return = returnFiber
        return existing
      }
    } else {
      deleteChild(returnFiber, child)
    }

    child = child.sibling
  }

  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}


function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions
  if (deletions === null) {
    returnFiber.deletions = [childToDelete]
    returnFiber.flags |= 'Deletion'
  } else {
    deletions.push(childToDelete)
  }
}

function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild
  while(childToDelete) {
    deleteChild(returnFiber, childToDelete)
    childToDelete = childToDelete.sibling
  }
  return null
}

function createFiberFromElement(
  element
) {
  const type = element.type
  const key = element.key
  const pendingProps = element.props
  const fiber = createFiberFromElement(
    type,
    key,
    pendingProps
  )
  return fiber
}

function createFiberFromElement(
  type,
  key,
  pendingProps
) {
  let fiberTag = 'IndeterminateComponent'
  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = ClassComponent
    }
  } else if (typeof type === 'string') {
    fiberTag = 'HostComponent'
  } else {

  }

  let resolvedType = type

  const fiber = createFiber(fiberTag, pendingProps, key)
  fiber.elementType = type
  fiber.type = resolvedType

  return fiber
}


const workInProgress = {
  deletions: null
}

const children = [
  {
    tag: 'you'
  },
  {
    tag: 'are'
  },
  {
    tag: 'summer'
  }
]

for (let i = 0; i < children.length - 1; i++) {
  children[i].sibling = children[i + 1]
}

deleteRemainingChildren(workInProgress, children[0])
console.log(workInProgress)

/*
reconcileSingleElement(
  workInProgress,
  null,
  element
)
*/

