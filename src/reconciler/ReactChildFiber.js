import { ElementType, FiberTag } from "../constant";
import { createFiberFromText, createFiberFromElement, createFiberFromFragment} from "./Fiber";

export function reconcileChildren(current, workInProgress, nextChildren) {
  workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);

function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      deletions = [childToDelete];
    } else {
      deletions.push(childToDelete);
    }
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    let childToDelete = currentFirstChild;
    while (childToDelete) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function placeSingleChild(newFiber) {
    return newFiber;
  }

  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent
  ) {
    deleteRemainingChildren(returnFiber, currentFirstChild);
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;

    // Reuse element
    // let child = currentFirstChild;
    // while (child !== null) {
    //   if (child.key !== key) {
    //     switch (child.tag) {
    //       case FiberTag.Fragment:
    //         if (element.type === ElementType.REACT_ELEMENT_TYPE) {
    //           deleteRemainingChildren(returnFiber, child);
    //           const existing = useFiber(child, element.props.children);
    //           existing.return = returnFiber;
    //           return existing
    //         }
    //         break
    //       default: {
    //         if (child.elementType === element.type) {
    //           deleteRemainingChildren(returnFiber, child)
    //           const existing = useFiber(child, element.props)
    //           existing.return = returnFiber
    //           return existing
    //         }
    //       } 
    //     }
    //     deleteRemainingChildren(returnFiber, child);
    //   } else {
    //     deleteChild(returnFiber, child);
    //   }

    //   child = child.sibling;
    // }

    // Replaced by children when element is a fragment
    if (element.type === ElementType.REACT_FRAGMENT_TYPE) {
      const created = createFiberFromFragment(
        element.props.children,
        element.key
      );
      created.return = returnFiber;
      return created;
    } else {
      const created = createFiberFromElement(element);
      created.return = returnFiber;
      return created;
    }
  }

  function reconcileChildrenArray(
    returnFiber,
    currentFirstChild,
    newChildren
  ) {
    let resultingFirstChild = null
    let previousNewFiber = null

    let oldFiber = currentFirstChild
    let newIdx = 0
    if (oldFiber === null) {
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx])
        if (newFiber === null) {
          continue
        }

        if (previousNewFiber === null) {
          resultingFirstChild = newFiber
        } else {
          previousNewFiber.sibling = newFiber
        }
        previousNewFiber = newFiber
      }
      return resultingFirstChild
    }
  }

  function createChild(
    returnFiber,
    newChild
  ) {


    if (typeof newChild === 'string' || typeof newChild === 'number') {
      const created = createFiberFromText( '' + newChild)
      created.return = returnFiber
      return created
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch(newChild.$$typeof) {
        case ElementType.REACT_ELEMENT_TYPE:
          const created = createFiberFromElement(
            newChild
          )
          created.return = returnFiber
          return created
      }
    }

    return null

  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    const isObject = typeof newChild === "object" && newChild !== "null";
    if (isObject) {
      switch (newChild.$$typeof) {
        case ElementType.REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
      }
    }

    if (typeof newChild === "string" || typeof newChild === "number") {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild)
      );
    }

    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(
        returnFiber,
        currentFirstChild,
        newChild
      )
    }


  }

  return reconcileChildFibers;
}


function coerceRef(
  returnFiber,
  current,
  element
) {
  const mixedRef = element.ref
  if (mixedRef !== null &&
    typeof mixedRef !== 'function')

  return mixedRef
}