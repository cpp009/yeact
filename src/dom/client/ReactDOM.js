import {
  createContainer,
  updateContainer,
} from "../../reconciler/FIberReconciler";
import { createLegacyRoot } from "./ReactDOMRoot";

/**
 * 
 * 
fiberRoot = {
  _internalRoot: {
    containerInfo: dom#div,
    current: HostRootFiber {

    }
  }
}
 * 
 */
function render(element, container) {
  let root = container._reactRootContainer;
  let fiberRoot;

  if (!root) {
    // mount
    root = container._reactRootContainer = createLegacyRoot(container)
    fiberRoot = root._internalRoot
  } else {
    // update
    fiberRoot = root._internalRoot;
  }

  updateContainer(element, fiberRoot)
}

export default {
  render,
};
