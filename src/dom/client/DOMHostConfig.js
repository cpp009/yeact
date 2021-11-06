import setTextContent from "./setTextContent";




export function resetTextContent(domElement) {
  setTextContent(domElement, '')
}



export function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps,

) {

  updateProperties(domElement, updatePayload, type, oldProps, newProps)
}

export function updateProperties(
  domElement,
  updatePayload,
  tag,
  lastRawProps,
  nextRawProps
) {
  if (
    tag === 'input' &&
    nextRawProps.type === 'radio' &&
    nextRawProps.name != null
  ) {
    ReactDOMInputUpdateChecked(domElement, nextRawProps)
  }


  updateDOMProperties(
    domElement,
    updatePayload,
  )


}


function updateDOMProperties(
  domElement,
  updatePayload,
) {
  for (let i = 0; i < updatePayload.length; i++) {
    const propKey = updatePayload[i]
    const propValue = updatePayload[i + 1]
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue)
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML()
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue)
    } else {
      setValueForProperty(domElement, propKey, propValue)
    }
  }
}