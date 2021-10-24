function processUpdateQueue(workInProgress, props, instance) {
  const queue = workInProgress.updateQueue;
  console.log(queue);

  let firstBaseUpdate = queue.firstBaseUpdate;
  let lastBaseUpdate = queue.lastBaseUpdate;

  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;

    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = pendingQueue.next;
    lastPendingUpdate.next = null;

    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }

    lastBaseUpdate = lastPendingUpdate;
  }

  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;

    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;

    let update = firstBaseUpdate;
    do {
      newState = getStateFromUpdate(workInProgress, queue, update, newState);
      update = update.next;
      if (update === null) {
        pendingQueue = queue.shared.pending;
        if (pendingQueue === null) {
          break;
        } else {
          const lastPendingUpdate = pendingQueue;
          const firstPendingUpdate = lastPendingUpdate.next;

          lastPendingUpdate.next = null;
          update = firstPendingUpdate;
          queue.lastBaseUpdate = lastPendingUpdate;
          queue.shared.pending = null;
        }
      }
    } while (true);

    workInProgress.memoizedState = newState;
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
  const payload = update.payload;

  let partialState;
  if (typeof payload === "function") {
    partialState = payload.call(instance, prevState, nextProps);
  } else {
    partialState = payload;
  }

  if (partialState === null || partialState === undefined) {
    return prevState;
  }

  return Object.assign({}, prevState, partialState);
}

const update = {
  callback: null,
  next: null,
  payload: {
    element: {
      type: "Mode",
    },
  },
  tag: 0,
};

update.next = {
  payload: {
    name: "summer",
  },
};

update.next.next = {
  payload: {
    are: "are",
  },
};

update.next.next.next = {
  payload: {
    he: "winter",
  },
  next: update,
};


const workInProgress = {
  updateQueue: {
    lastBaseUpdate: null,
    shared: {
      pending: update,
    },
  },
}
const ret = processUpdateQueue(workInProgress);

console.log(workInProgress.memoizedState);
