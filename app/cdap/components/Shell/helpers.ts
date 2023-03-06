import _zipWith from 'lodash/zipWith';
import _identity from 'lodash/identity';
import React from 'react';

export function renderIfVisible(
  visibilityArray: boolean[],
  elementsArray: React.ReactNode[]
): React.ReactNode[] {
  return _zipWith(visibilityArray, elementsArray, (isVisible, element) =>
    isVisible ? element : false
  ).filter(Boolean);
}

export function usePropSync(props, stateUpdater, configKey, transform = _identity) {
  React.useEffect(() => {
    stateUpdater({ [configKey]: transform(props[configKey]) });
  }, [props[configKey]]);
}

export function makePropSync(props, stateUpdater) {
  return (configKey, transform = _identity) =>
    usePropSync(props, stateUpdater, configKey, transform);
}
