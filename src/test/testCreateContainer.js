import { createLegacyRoot } from "../dom/client/ReactDOMRoot";
import { createContainer } from "../reconciler/FIberReconciler";


export default function () {
  const root = createContainer(null)
  console.log(root, 'xx')
} 