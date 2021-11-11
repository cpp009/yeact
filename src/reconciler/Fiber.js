import { FiberTag } from "../constant";
import { NoFlags } from "./FiberFlags";
import { HostRoot } from "./WorkTags";


function FiberNode(tag, pendingProps, key) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;

  //Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  (this.pendingProps = pendingProps), (this.memoizedProps = null);
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  // Effects
  this.flags = "NoFlags";
  this.subtreeFlags = "NoFlags";
  this.deletions = null;

  this.alternate = null;
}

export function FiberRootNode(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.current = null;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}


export function createFiberFromText(content) {
  const fiber = createFiber(FiberTag.HostText, content)
  return fiber
}

export function createFiberFromFragment(
  elements,
  key
) {
  const fiber = createFiber(FiberTag.Fragment, elements, key)
  return fiber
}

export function createFiberFromElement(element) {
  const type = element.type;
  const key = element.key;
  const pendingProps = element.props;
  const fiber = createFiberFromTypeAndProps(type, key, pendingProps);
  return fiber;
}

export function createFiberFromTypeAndProps(type, key, pendingProps) {
  let fiberTag = FiberTag.IndeterminateComponent;
  let resolvedType = type;

  if (typeof type === "function") {
    if (shouldConstruct(type)) {
      fiberTag = FiberTag.ClassComponent;
    }
  } else if (typeof type === "string") {
    fiberTag = FiberTag.HostComponent;
  } else {
    getTag: switch (type) {
    }
  }

  const fiber = createFiber(fiberTag, pendingProps, key);
  fiber.elementType = type;
  fiber.type = resolvedType;

  return fiber;
}


export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}

export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate
  if (workInProgress ===  null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key
    )

    workInProgress.elementType = current.elementType
    workInProgress.type = current.type
    workInProgress.stateNode = current.stateNode

    workInProgress.alternate = current
    current.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.type = current.type

    workInProgress.flags = NoFlags
    workInProgress.nextEffect = null
    workInProgress.firstEffect = null
    workInProgress.lastEffect = null
  }


  workInProgress.child = current.child
  workInProgress.memoizedProps = current.memoizedProps
  workInProgress.memoizedState = current.memoizedState
  workInProgress.updateQueue = current.updateQueue

  workInProgress.sibling = current.sibling
  workInProgress.index = current.index
  workInProgress.ref = current.ref

  return workInProgress
}