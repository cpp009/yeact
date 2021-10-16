console.log('Hello Yeact...')




// Representation of JSX
function createElement(type, config, children) {

  return {
    type,
    key: config?.key,
    props: {
      children
    }
  }
}


// Render JSX element
function render(
  element,
  container
) {

  // element container to fiber
  const root = createRootFromContainer(container);
  debugger
  // insert element to container fiber
  updateContainer(root, element)
}


function createRootFromContainer(container) {
  // trasform DOM container to fiber

}

function updateContainer(root, element) {
  const current = root.current
  // create update
  const update = {
    payload: null,
    callback: null,
    next: null
  }

  // enqueue update to root fiber root
  enqueueUpdate(current, update)

  // schedule on fiber
  scheduleUpdateOnFiber(current)
}

function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue

  // circle list
  const pending = updateQueue.pending
  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  updateQueue.pending = update

}

function FiberRootNode(containerInfo, tag) {
  this.tag = tag
  this.containerInfo = containerInfo
  this.current = null
}


const root = document.getElementById('root')
const div = document.createElement('div')
div.innerHTML = 'Hello cpp'
root.appendChild(div)

const ele =  createElement('div', null, createElement('span', {}, 'hello kis'))
render(ele, root)