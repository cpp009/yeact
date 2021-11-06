import { ContentReset, Deletion, Placement, PlacementAndUpdate, Ref, Update } from "../reconciler/FiberFlags"



let firstEffect = {
  name: 'a',
  nextEffect: {
    name: 'b',
    nextEffect: {
      name: 'c',
      nextEffect: null
    }
  }
}


const root = {
  firstEffect
}

let nextEffect = null

function commitRoot(root) {

  let firstEffect = root.firstEffect

  if (firstEffect !== null) {
    console.log('has effect')

    nextEffect = firstEffect
    commitBeforeMutationEffects()

    nextEffect = firstEffect
    commitMutationEffects(root)

    nextEffect = firstEffect
    commitLayoutEffects(root)
  }
}

function commitBeforeMutationEffects() {
  console.log('function commit before mutation effects')

  while(nextEffect !== null) {
    nextEffect = nextEffect.nextEffect
  }
}

function commitMutationEffects(root) {
  console.log('function commit Mutation Effects')

  while(nextEffect !== null) {
    console.log(nextEffect.name)

    const flags = nextEffect.flags

    if (flags & ContentReset) {
      // 重置 text 内容
    }

    if (flags & Ref) {
      // 清空 ref
    }

    const primaryFlags = falgs & (Placement | Update | Deletion)
    switch(primaryFlags) {
      case PlacementAndUpdate:
        commitPlacement(nextEffect)
        nextEffect.flags &= ~Placement

        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
    }
    nextEffect = nextEffect.nextEffect
  }
}

function commitLayoutEffects(root) {
  console.log('function commit layout effects')
}

commitRoot(root)

