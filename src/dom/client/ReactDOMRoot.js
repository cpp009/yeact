import { createHostRootFiber } from "../../reconciler/Fiber"
import { createContainer } from "../../reconciler/FIberReconciler"
import { initializeUpdateQueue } from "../../reconciler/UpdateQueue"





export function createLegacyRoot(container) {
  return new ReactBlockingRoot(container)
}

function ReactBlockingRoot(container) {
  this._internalRoot = createRoot(container)
}

function createRoot(container) {
  // create fiberRoot container
  const root = createContainer(container)

  // listen event
  

  return root
}