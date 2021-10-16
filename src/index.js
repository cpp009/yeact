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
  // insert element to container fiber
  updateContainer(root, element)
}


function createRootFromContainer(container) {
  // trasform DOM container to fiber
}

function updateContainer(root, element) {

}

const root = document.getElementById('root')
console.log(root)
