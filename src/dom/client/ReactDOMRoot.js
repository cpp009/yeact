import { createHostRootFiber } from "../../reconciler/Fiber"
import { createContainer } from "../../reconciler/FIberReconciler"
import { initializeUpdateQueue } from "../../reconciler/UpdateQueue"

const randomKey = Math.random().toString(36).slice(2)
export const internalContainerKey = '__reactContainer$' + randomKey
export const internalInstanceKey = '__reactInstance$' + randomKey
export const intenralReactPropsKey = '__reactPropsKey$' + randomKey

const allNativeEvents = new Set()
const regitrationNameDependencies = {}

allNativeEvents.add('click')

const ELEMENT_NODE = 1
const TEXT_NODE = 3

export function createLegacyRoot(container) {
  return new ReactBlockingRoot(container)
}

function ReactBlockingRoot(container) {
  this._internalRoot = createRoot(container)
}

function createRoot(container) {
  if (!container) {
    throw new Error('container dom can not be empty')
  }
  // create fiberRoot container
  const root = createContainer(container)
  console.log(container)

  // listen event

  listenToAllSupportedEvents(container)
  return root
}


function listenToAllSupportedEvents(rootContainerElement) {

  allNativeEvents.forEach(domEventName => {
      listenToNativeEvent(
        domEventName,
        true,
        rootContainerElement,
        null
      )
  })
}

function listenToNativeEvent(
  domEventName,
  isCapture,
  rootTarget,
  target
) {
  target = target || rootTarget

  const listener = createListener(domEventName, rootTarget)

  target.addEventListener(domEventName, listener)
}

function createListener(
  domEventName,
  targetContainer
) {
  return dispatchEvent.bind(null, domEventName, null, targetContainer)
}

function dispatchEvent(domEventName, eventSystemFlags, targetContainer, nativeEvent)  {

  // find path
  const nativeEventTarget = nativeEvent.target
  const props = nativeEventTarget[intenralReactPropsKey]
  const reactEventName = 'on' + domEventName[0].toUpperCase() + domEventName.slice(1)

  for (const prop in props) {
    if (props.hasOwnProperty(prop) && prop === reactEventName) {
      props[prop](nativeEvent)
    }
  }

}

function getEventTarget(event) {
  let target = event.target

  return target.nodeType === TEXT_NODE ? target.parentNode : target
}