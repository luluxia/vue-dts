const document = window.document as any;
export function transitionHelper({
  skipTransition = false,
  classNames = [],
  updateDOM = () => {},
}) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => {});

    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
      skipTransition: () => {},
    };
  }

  document.documentElement.classList.add(...classNames);

  const transition = document.startViewTransition(updateDOM);

  transition.finished.finally(() =>
    document.documentElement.classList.remove(...classNames)
  );

  return transition;
}