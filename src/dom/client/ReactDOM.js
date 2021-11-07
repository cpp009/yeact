import { createContainer, updateContainer } from "../../reconciler/FIberReconciler"




function render(element, container) {
  const root = createContainer()
  const fiberRoot = root._internalRoot
  updateContainer(element, fiberRoot)
}

export default {
  render,
}
