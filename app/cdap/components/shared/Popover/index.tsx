/*
 * Copyright © 2023 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { usePopper } from 'react-popper';
import { Observable } from 'rxjs/Observable';
import Mousetrap from 'mousetrap';
import classnames from 'classnames';
import { preventPropagation, isDescendant } from 'services/helpers';
import uuidV4 from 'uuid/v4';
import ee from 'event-emitter';
import debounce from 'lodash/debounce';
import { useOnUnmount } from '../../../services/react/customHooks/useOnUnmount';
require('./Popover.scss');

interface IPopoverProps extends PropsWithChildren {
  target: (props?: any) => JSX.Element;
  targetDimension?: { [x: string]: any };
  className?: string;
  showOn?: 'Click' | 'Hover';
  bubbleEvent?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  enableInteractionInPopover?: boolean;
  injectOnToggle?: boolean;
  showPopover?: boolean;
  onTogglePopover?: (x: boolean) => void;
  modifiers?: { [x: string]: any };
  tag?: string;
  dataTestId?: string;
}

const eventEmitter = ee(ee);

/**
 * The old version of the popper expected modifiers in the form
 * { modifierKey: modifierValues }
 * The new version expects popper modifiers in the form
 * [{ name: modifierKey, options: modifierValues }]
 * This function converts them the old form into the new one
 * @param modifiersObject
 * @returns modifierArray
 */
const convertModifiers = (
  modifiersObject: IPopoverProps['modifiers']
): Array<{ name: string; options: { [x: string]: any } }> => {
  return Object.keys(modifiersObject).map((key) => {
    return {
      name: key,
      options: modifiersObject[key],
    };
  });
};

export const Popover = ({
  children,
  target: PopoverTarget,
  targetDimension,
  className,
  showOn = 'Click',
  bubbleEvent = true,
  placement,
  enableInteractionInPopover = false,
  injectOnToggle = false,
  showPopover,
  onTogglePopover,
  modifiers = {
    preventOverflow: {
      enabled: true,
      boundariesElement: 'scrollParent',
    },
  },
  tag = 'div',
  dataTestId,
}: IPopoverProps) => {
  const [show, setShowPopover] = useState(showPopover);
  const id = `popover-${uuidV4()}`;
  const didMount = useRef(false);
  let documentClick;
  useEffect(() => {
    eventEmitter.on('POPOVER_OPEN', hidePopoverEventHandler);
  }, []);

  useEffect(() => {
    // mimic cDidMount
    if (didMount.current === false) {
      didMount.current = true;
    } else {
      if (show) {
        updateParentOnToggle();
      }
    }
  }, [show]);

  useOnUnmount(() => {
    cleanUpDocumentClickEventHandler();
    eventEmitter.off('POPOVER_OPEN', hidePopoverEventHandler);
  });

  const hidePopoverEventHandler = (popoverId) => {
    if (
      id !== popoverId &&
      !document
        .getElementById(id)
        .contains(document.getElementById(popoverId)) &&
      show
    ) {
      setShowPopover(false);
    }
  };

  const updateParentOnToggle = () => {
    if (onTogglePopover) {
      onTogglePopover(show);
    }
  };

  const cleanUpDocumentClickEventHandler = () => {
    if (documentClick) {
      documentClick.unsubscribe();
    }
    documentClick = undefined;
    Mousetrap.unbind('esc');
  };

  const togglePopover = (e?: Event) => {
    if (!show) {
      if (showOn !== 'Hover') {
        eventEmitter.emit('POPOVER_OPEN', id);
      }

      documentClick = Observable.fromEvent(document, 'click', {
        capture: true,
      }).subscribe((event: Event) => {
        const parent = document.getElementById(id);
        const child = event.target;
        if (enableInteractionInPopover && isDescendant(parent, child)) {
          // Just return instead of stopping propagation.
          // This will allow to nest popovers and close the inner popover
          // while clicking on the outer one.
          return;
        }
        cleanUpDocumentClickEventHandler();
        setShowPopover(!show);
      });

      Mousetrap.bind('esc', togglePopover);
    } else {
      cleanUpDocumentClickEventHandler();
    }

    handleBubbleEvent(e);

    setShowPopover(!show);
  };

  const handleBubbleEvent = (e) => {
    if (!bubbleEvent) {
      preventPropagation(e);
      return false;
    }
  };

  const onMouseOverToggle = () => {
    if (!show) {
      togglePopover();
    }
  };

  const onMouseOutToggle = () => {
    if (show) {
      togglePopover();
    }
  };

  const targetProps = {
    style: targetDimension,
  };

  if (showOn === 'Click') {
    targetProps[`on${showOn}`] = togglePopover;
  } else if (showOn === 'Hover') {
    // We can debounce this by 100ms as the mouse move events are
    // triggered way too often.
    targetProps.onMouseOver = debounce(onMouseOverToggle, 100);
    targetProps.onMouseOut = debounce(onMouseOutToggle, 100);
  }

  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,

    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      ...convertModifiers(modifiers),
    ],
  });
  const PopoverTargetElement = PopoverTarget;

  return (
    // <Manager>
    <>
      <span
        {...targetProps}
        className={className}
        data-testid={dataTestId}
        ref={setReferenceElement}
      >
        {/* {React.cloneElement(PopoverTarget(), { */}
        <PopoverTargetElement className={classnames({ active: show })} />
        {/* })} */}
      </span>

      <div
        className={classnames('popper', {
          hide: !show,
          tooltip: showOn === 'Hover',
        })}
        role="button"
        onClick={handleBubbleEvent}
        id={id}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {injectOnToggle ? (show ? children : null) : children}
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
    // </Manager>
  );
};

export default Popover;

