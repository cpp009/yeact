import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";

export function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren);
  }
}
