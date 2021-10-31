
import { createFiber,  FiberRootNode} from "./reconciler/Fiber";
const { FiberTag, UpdateTag, ElementType } = require("./constant");
import {reconcileChildren} from './reconciler/FiberBeginWork'

console.log("Hello Yeact...");

let workInProgress = null;

// Representation of JSX
function createElement(type, config, children) {
  return {
    $$typeof: ElementType.REACT_ELEMENT_TYPE,
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
    baseState: null,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
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
    payload: { element },
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
  workInProgress = createWorkInProgress(fiber, null);

  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }

  commitRoot(fiber);
}

function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate; // current
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);

    workInProgress.alternate = current; // 当前的原来的
    current.alternate = workInProgress; // 原来的指向现在的
  } else {
    workInProgress.pendingProps = process;
    workInProgress.type = current.type;
  }

  workInProgress.child = current.child;
  workInProgress.updateQueue = current.updateQueue;

  return workInProgress;
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate; // 以前的
  let next = beginWork(current, unitOfWork);

  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
  } else {
    workInProgress = next;
  }

  workInProgress = null;
}

function beginWork(current, workInProgress) {
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
      case FiberTag.HostRoot:
        updateHostRoot(current, workInProgress);
        break;
      case FiberTag.HostComponent:
        break;
    }
  }
}

function updateHostRoot(current, workInProgress) {
  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState !== null ? prevState.element : null;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null);
  const nextState = workInProgress.memoizedState
  const nextChildren = nextState.element

  reconcileChildren(current, workInProgress, nextChildren)

  // child 的 fiber 已经通过 reconcileChildren 创建，所以返回 child 给上层
  // 作为 next 变量赋值给 workInProgress 来继续构造这一颗 fiber tree
  return workInProgress.child;
}

function cloneUpdateQueue(current, workInProgress) {
  const queue = current.updateQueue;
  const currentQueue = workInProgress.updateQueue;

  // reference equal
  if (queue === currentQueue) {
    workInProgress.updateQueue = {
      baseState: currentQueue.baseState,
      firstBaseUpdate: currentQueue.firstBaseUpdate,
      lastBaseUpdate: currentQueue.lastBaseUpdate,
      shared: currentQueue.shared,
      effects: currentQueue.effects,
    };
  }
}

function processUpdateQueue(workInProgress, nextProps, instance) {
  const queue = workInProgress.updateQueue;

  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate;

  // Create single link list, break the cycle link list
  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;

    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;

    // Append pending updates to base queue
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;

    const current = workInProgress.alternate;
    if (current !== null) {
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate !== lastBaseUpdate) {
        currentQueue.firstBaseUpdate = firstPendingUpdate;
      } else {
        currentLastBaseUpdate.next = firstPendingUpdate;
      }
      currentQueue.lastBaseUpdate = lastPendingUpdate;
    }
  }

  // values may change, Merge update to state
  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;

    let update = firstBaseUpdate;
    do {
      console.log(update);
      newState = getStateFromUpdate(update, newState);
      update = update.next;
      if (update === null) {
        break;
      }
    } while (true);

    // assign new state
    workInProgress.memoizedState = newState
  }

}

function getStateFromUpdate(update, prevState) {
  const payload = update.payload;
  let partialState = payload;
  if (partialState === null || partialState === undefined) {
    return prevState;
  }
  return Object.assign({}, prevState, partialState);
}

function reconcileCSingleElement(returnFiber, currentFirstChild, element) {
  const created = createFiberFromElement(element);
  created.return = returnFiber;
  return created;
}


function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;

  // circle list
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
}

function commitRoot() {}

const root = document.getElementById("root");
const div = document.createElement("div");
div.innerHTML = "Hello cpp";
root.appendChild(div);

const arrayElement = createElement("span", {}, "hello kis")
const textElement = 'span'
const ele = createElement("div", null, textElement);
render(['kkk', 'bbb', 'ccc'], root);
