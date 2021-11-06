


function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork

  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return

    if ((completedWork.flags & InComplete) === NoFlags) {
      const next = completeWork(current, completedWork)

      if (next !== null) {
        workInProgress = next
        return ;
      }



    }

    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return;
    }

    completedWork = returnFiber
    workInProgress = completedWork
  } while(completedWork !== null)

  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted
  }
}


function completeWork(
  current,
  workInProgress
) {
  const newProps = workInProgress.pendingProps

  switch(workInProgress.tag) {
    case HostText: {
      
    }
  }
}