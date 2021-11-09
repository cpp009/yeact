

let hasForceUpdate = false

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;


export function createUpdate() {
  return {
    tag: UpdateState,
    payload: null,
    next: null
  }
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue
  const sharedQueue = updateQueue.shared
  const pending = sharedQueue.pending

  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  sharedQueue.pending = update
}


export function initializeUpdateQueue(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseState: null,
    lastBaseState: null,
    shared: {
      pending: null
    },
    effects: null
  }
  fiber.updateQueue = queue
}


export function processUpdateQueue(
  workInProgress,
  props,
  instance
) {

  const queue = workInProgress.updateQueue

  hasForceUpdate = false

  let firstBaseUpdate = queue.firstBaseState
  let lastBaseUpdate = queue.lastBaseState

  const pendingQueue = queue.shared.pending
  if (pendingQueue !== null) {
    queue.shared.pending = null

    const lastPendingUpdate = pendingQueue
    const firstPendingUpdate = lastPendingUpdate.next
    lastPendingUpdate.next = null
    if (firstBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate
    } else {
      lastBaseUpdate.next = firstPendingUpdate
    }
    lastBaseUpdate = lastPendingUpdate
  }


  if (firstBaseUpdate !== null) {

    let newState = queue.baseState

    let update = firstBaseUpdate
    do {

      newState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        newState,
        props
      )
      update = update.next
      if (update === null) {
        break
      }
    } while(ture)

    workInProgress.memoizedState = newState
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
  let partialState = partialState

  if (partialState === null || partialState === undefined) {
    return prevState
  }

  return Object.assign({}, prevState, partialState)
}