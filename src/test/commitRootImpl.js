function commitRootImpl(root) {
  let firstEffect = null;

  nextEffect = firstEffect;
  do {
    commitBeforeMutationEffects();
  } while (nextEffect !== null);

  // mutation phase
  nextEffect = firstEffect;
  do {
    commitMutationeffects(root);
  } while (nextEffect !== null);

  // layout phase
}

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate

    const flags = nextEffect.flags;
    if ((flags & Snapshot) !== NoFlags) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    if ((flags & Passive) !== NoFlags) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true
        scheduleCallback(() => {
          flushPassiveEffects()
        })
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}


function commitMutationeffects(
  root
) {
  while (nextEffect !== null) { 

    const flags = nextEffect.flags


    const primaryFlags = flags & (Placement | Update | Deletion | Hydrating)
    switch(primaryFlags) {
      case Placement: {
        commitPlacement(nextEffect)
        nextEffect.flags &= ~Placement
      }
    }

    nextEffect = nextEffect.nextEffect
  }
}


function commitPlacement(finishWork) {

}

function insertOrAppendPlacementNode(
  node,
  before,
  parent
) {
  
}