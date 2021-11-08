import { createFiberRoot } from "./FiberRoot";
import { scheduleUpdateOnFiber } from "./FiberWorkLoop";
import { createUpdate, enqueueUpdate } from "./UpdateQueue";




export function updateContainer(
  element,
  container
) {

  const current = container.current
  
  const update = createUpdate()
  update.payload = {element}
  
  enqueueUpdate(current, update)
  scheduleUpdateOnFiber(current)
}

export function createContainer(
  containerInfo // DOM element of root
) {
  return createFiberRoot(containerInfo)
}
