import { resetTextContent } from "../dom/client/DOMHostConfig"
import { ContentReset, Placement } from "./FiberFlags"
import { HostComponent, HostPortal, HostRoot, HostText } from "./WorkTags"




export function commitPlacement(finishedWork) {


  const parentFiber = getHostParentFiber(finishedWork)


  let parent
  let isContainer
  const parentStateNode = parentFiber.stateNode
  switch(parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode
      isContainer = false
      break;
    case HostRoot:
      parent = parentStateNode.containerInfo
      isContainer = true
      break
    default:
      throw new Error('Invalid host parent fiber')
  }

  if (parentFiber.flags & ContentReset) {
    resetTextContent(parent)
    parentFiber.flags &= ~ContentReset
  }

  const before = getHostSibling(finishedWork)

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent)
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent)
  }

}

function getHostParentFiber(fiber) {
  let parent = fiber.return
  while(parent !== null)  {
    if (isHostParent(parent)) {
      return parent
    }
    parent = parent.return
  }
  throw new Error('Not find a host parent node')
}

function isHostParent(fiber) {
  return (
    fiber.tag === HostComponent ||
    fiber.tag === HostRoot ||
    fiber.tag === HostPortal
  )
}

function getHostSibling(fiber) {
  let node = fiber
  siblings: while(true) {
    // 找到下一个兄弟，或者找到上级的下一个兄弟
    while(node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null
      }
      node = node.return
    }
    // 将 siblging 连接到 parent
    node.sibling.return = node.return
    node = node.sibling
    while(
      node.tag !== HostComponent &&
      node.tag !== HostText
    ) {
      if (node.flags & Placement) {
        continue siblings
      }

      if (node.child === null || node.tag === HostPortal) {
        continue siblings
      } else {
        node.child.return = node
        node = node.child
      }
    }

    if (!(node.flags & Placement)) {
      // Found it
      return node.stateNode
    }
  }
}

function insertOrAppendPlacementNode(
  node,
  before,
  parent
) {
  const {tag} = node
  const isHost = tag === HostComponent || tag === HostText
  if (isHost) {
    const stateNode = isHost ? node.stateNode : node.stateNode.instance
    if (before) {
      insertBefore(parent, stateNode, before)
    } else {
      appendChild(parent, stateNode)
    }
  } else if (tag === HostPortal) {

  } else {
    const child = node.child
    if (child !== null) {
      // 不是 host DOM 元素就是 component 组件，需要递归的将整个组件都插入到DOM 中
      insertOrAppendPlacementNode(child, before, parent)
      let sibling = child.sibling
      while(sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent)
        sibling = sibling.sibling
      }
    }
  }
}


function commitWork(current, finishedWork) {
  switch(finishedWork.tag) {
    case HostComponent: 
      const instance = finishedWork.stateNode
      if (instance !== null) {
        const newProps = finishedWork.memoizedProps
        const oldProps = current !== null ? current.memoizedProps : newProps

        const type = finishedWork.type
        const updatePayload = finishedWork.updateQueue
        finishedWork.updateQueue = null
        if (updatePayload !== null) {
          commitUpdate(
            instance,
            updatePayload,
            type,
            oldProps,
            newProps,
            finishedWork
          )
        }
      }
      return 
  }
}

function unmountHostComponents(
  finishedWork,
  current
) {
  let node = current

  let currentParentIsValid = false
  let currentParent
  let currentParentIsContainer
  while(true) {
    if (currentParentIsValid) {
      let parent = node.return
      findParent: while(true) {
        const parentStateNode = parent.staetNode
        switch(parent.tag) {
          case HostComponent:
            currentParent  = parentStateNode
            currentParentIsContainer = false
            break findParent
          case HostRoot:
            currentParent = parentStateNode
            currentParentIsContainer = true
        }

        parent = parent.return
      }
      currentParentIsValid = false
    }


    if (node.tag === HostComponent || node.tag === HostText) {
      commitNestedUnmounts(finishedWork, node)
      remvoeChild(currentParent, ndoe.stateNode)
    } else if (kk){
      const fundamentalNode = node.staetNode.instance
      commitNestedUnmounts(finishedWork, nod)
      remvoeChild(currentParent, fundamentalNode)
    } else {
      // 组件 DOM 要依次从根到叶子全部去掉
      commitUnmount(finishedWork, node)
      if (node.child !== null) {
        node.child.return = node
        node = node.child
        continue
      }
    }
  }
}