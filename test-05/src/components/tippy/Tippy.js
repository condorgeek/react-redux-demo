/*
 * Proprietary and Confidential
 *
 * Copyright (c) [2018] -  [] Marcelo H. Krebber - Munich, London 2018
 * All Rights Reserved.
 *
 * Dissemination or reproduction of this file [Tippy.js] or parts within
 * via any medium is strictly forbidden unless prior written permission is obtained
 * from <marcelo.krebber@gmail.com>
 *
 * Last modified: 09.03.19 16:41
 */

import React, {
  forwardRef,
  cloneElement,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import tippy from '../util/tippy.4.0.4.all.patched.js'
import { ssrSafeCreateDiv, preserveRef, updateClassName } from './utils'

// React currently throws a warning when using useLayoutEffect
// on the server. To get around it, we can conditionally
// useEffect on the server (no-op) and useLayoutEffect in the
// browser. We need useLayoutEffect because we want Tippy to
// perform sync mutations to the DOM elements after renders
// to prevent jitters/jumps, especially when updating content.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' && typeof document !== 'undefined'
    ? useLayoutEffect
    : useEffect;

function Tippy({
  children,
  content,
  className,
  onCreate,
  isEnabled = true,
  isVisible,

  ...nativeProps
}) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef(ssrSafeCreateDiv());
  const targetRef = useRef();
  const instanceRef = useRef();
  const isControlledMode = typeof isVisible === 'boolean';

  const options = {
    // ...nativeProps,
      arrow: true, duration: 500, delay: [100, 50],
    content: containerRef.current,
  };

  if (isControlledMode) {
    options.trigger = 'manual'
  }

  useIsomorphicLayoutEffect(() => {
    instanceRef.current = tippy(targetRef.current, {...options, ...nativeProps});

    if (onCreate) {
      onCreate(instanceRef.current)
    }

    if (!isEnabled) {
      instanceRef.current.disable()
    }

    if (isVisible) {
      instanceRef.current.show()
    }

    setIsMounted(true);

    return () => {
      instanceRef.current.destroy();
      instanceRef.current = null
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isMounted) {
      return
    }

    instanceRef.current.set(options);

    if (isEnabled) {
      instanceRef.current.enable()
    } else {
      instanceRef.current.disable()
    }

    if (isControlledMode) {
      if (isVisible) {
        instanceRef.current.show()
      } else {
        instanceRef.current.hide()
      }
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (className) {
      const { tooltip } = instanceRef.current.popperChildren;
      updateClassName(tooltip, 'add', className);
      return () => {
        updateClassName(tooltip, 'remove', className)
      }
    }
  }, [className]);

  return (
    <>
      {cloneElement(children, {
        ref: node => {
          targetRef.current = node;
          preserveRef(children.ref, node)
        },
      })}
      {isMounted && createPortal(content, containerRef.current)}
    </>
  )
}

Tippy.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  children: PropTypes.element.isRequired,
  onCreate: PropTypes.func,
  isVisible: PropTypes.bool,
  isEnabled: PropTypes.bool,
  className: PropTypes.string,
};

Tippy.defaultProps = {
  ignoreAttributes: true,
};

export default forwardRef(function TippyWrapper({ children, ...props }, ref) {
  return (
    <Tippy {...props}>
      {cloneElement(children, {
        ref: node => {
          preserveRef(ref, node);
          preserveRef(children.ref, node)
        },
      })}
    </Tippy>
  )
})
