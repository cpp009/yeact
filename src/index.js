const { FiberTag, UpdateTag } = require("./constant");

console.log("Hello Yeact...");

let workInProgress = null;

// Representation of JSX
function createElement(type, config, children) {
  return {
    type,
    key: config?.key,
    props: {
      children,
    },
  };
}

// Render JSX element
function render(element, container) {
  // element container to fiber
  const root = createRootFromContainer(container);
  // insert element to container fiber
  updateContainer(element, root);
}

function createRootFromContainer(container) {
  // trasform DOM container to fiber

  // FiberRoot
  const root = new FiberRootNode(container, "");

  // fiber
  root.current = createFiber(FiberTag.HostRoot, null, null);
  root.current.stateNode = root; // Fiber to Fiber Root

  // init
  root.current.updateQueue = {
    shared: {
      pending: null,
    },
    effects: null,
  };
  return root;
}

function updateContainer(element, container) {
  const current = container.current;
  // create update
  const update = {
    payload: {element},
    tag: UpdateTag.UpdateState,
    callback: null,
    next: null,
  };

  // enqueue update to root fiber root
  enqueueUpdate(current, update);

  // schedule on fiber
  scheduleUpdateOnFiber(current);
}

function scheduleUpdateOnFiber(fiber) {

  // init context
  workInProgress = createWorkInProgress(fiber, null)

  console.log(workInProgress)

  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }

  commitRoot(fiber);
}

function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate // current
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
    )

    workInProgress.alternate = current // 当前的原来的
    current.alternate = workInProgress // 原来的指向现在的
  } else {
    workInProgress.pendingProps = process
    workInProgress.type = current.type

  }

  workInProgress.child = current.child
  workInProgress.updateQueue = current.updateQueue

  return workInProgress
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate // 以前的
  let next = beginWork(current, unitOfWork)

  unitOfWork.memoizedProps = unitOfWork.pendingProps
  if (next === null) {

  } else {
    workInProgress = next
  }

  workInProgress = null
}

function beginWork(current, workInProgress) {

  if (current !== null) {
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps

    console.log(workInProgress)
    switch(workInProgress.tag) {
      case FiberTag.HostRoot:
        updateHostRoot(current, workInProgress)
        break
      case FiberTag.HostComponent: 
        break
      
    }


  }
}

function updateHostRoot(current, workInProgress) {

  const nextProps = workInProgress.pendingProps
  const prevState = workInProgress.memoizedState
  const prevChildren = prevState !== null ? prevState.element : null
  cloneUpdateQueue(current, workInProgress)
  console.log(workInProgress)
  processUpdateQueue(workInProgress, nextProps, null)
  //const nextState = workInProgress.memoizedState
  //const nextChildren = nextState.element

  // reconcileChildren(current, workInProgress, nextChildren)

  // child 的 fiber 已经通过 reconcileChildren 创建，所以返回 child 给上层
  // 作为 next 变量赋值给 workInProgress 来继续构造这一颗 fiber tree 
  return workInProgress.child
}


function cloneUpdateQueue(current, workInProgress) {
  const queue = current.updateQueue
  const currentQueue = workInProgress.updateQueue

  // reference equal
  if (queue === currentQueue) {
    workInProgress.updateQueue = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects
    }
  }
}

function processUpdateQueue(workInProgress, nextProps, instance) {
  const queue = workInProgress.updateQueue

  let firstBaseUpdate = queue.firstBaseUpdate
  let lastBaseUpdate = queue.lastBaseUpdate

  let pendingQueue = queue.shared.pending
  if (pendingQueue !== null) {
    queue.shared.pending = null

    const lastPendingUpdate = pendingQueue
    const firstPendingUpdate = lastPendingUpdate.next
    lastPendingUpdate.next = null

    // Append pending updates to base queue 
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate
    } else {
      lastBaseUpdate.next = firstPendingUpdate
    }
    lastBaseUpdate = lastPendingUpdate

    const current = workInProgress.alternate
    if (current !== null) {
      const currentQueue = current.updateQueue
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        currentQueue.firstBaseUpdate = firstPendingUpdate
      } else {
        currentLastBaseUpdate.next = firstPendingUpdate
      }
      currentQueue.lastBaseUpdate = lastPendingUpdate
    }
  }

  // values may change
  if (firstBaseUpdate !== null) { 
    let newState = queue.baseState

    let update = firstBaseUpdate
    do {

    }
  }
}

function getStateFromUpdate(
  workInProgress,
  queue,
  update,
  prevState,
  nextProps,
  instance
) {
  const payload = update.payload
  let partialState
  if (partialState === null || partialState === undefined) {
    return prevState
  }
  return Object.assign({}, prevState, partialState)
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
          reconcileCSingleElement(
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
        newChild + ''
      )
    )
  }

}


function reconcileCSingleElement(
  returnFiber,
  currentFirstChild,
  element
) {
  const created = createFiberFromElement(element)
  created.return = returnFiber
  return created
}


function createFiberFromElement(
  element
) {
  const type = element.type
  const key = element.key
  const pendingProps = element.props
  const fiber = createFiberFromTypeAndProps(
    type,
    key,
    pendingProps
  )
  return fiber
}

function createFiberFromTypeAndProps(
  type,
  key,
  pendingProps
) {
  let fiberTag = 'IndeterminateComponent'
  let resolvedType = type

  if (typeof type === 'function') {
    if (shouldConstruct(type)) {
      fiberTag = 'ClassComponent'
    }
  } else if (typeof type === 'string') {
    fiberTag = 'HostComponent'
  } else {
    getTag: switch(type) {

    }
  }

  const fiber = createFiber(fiberTag, pendingProps, key)
  fiber.elementType = type
  fiber.type = resolvedType

  return fiber
}


function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;

  // circle list
  const pending = updateQueue.shared;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.pending = update;
}

function commitRoot() {

}

function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

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

function FiberRootNode(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.current = null;
}

const root = document.getElementById("root");
const div = document.createElement("div");
div.innerHTML = "Hello cpp";
root.appendChild(div);

const ele = createElement("div", null, createElement("span", {}, "hello kis"));
render(ele, root);
