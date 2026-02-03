import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Easing presets for consistent motion
export const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Duration presets
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  smooth: 0.3,
  slow: 0.5,
  dramatic: 0.8,
};

/**
 * Fade up animation for elements entering the screen
 */
export const fadeUp = (element: Element | Element[], options?: {
  y?: number;
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
}) => {
  const {
    y = 40,
    opacity = 0,
    duration: dur = 0.6,
    delay: del = 0,
    stagger: st = 0,
  } = options || {};

  return gsap.fromTo(
    element,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration: dur,
      delay: del,
      stagger: st,
      ease: 'power3.out',
    }
  );
};

/**
 * Fade in animation
 */
export const fadeIn = (element: Element | Element[], options?: {
  opacity?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
}) => {
  const {
    opacity = 0,
    duration: dur = 0.5,
    delay: del = 0,
    stagger: st = 0,
  } = options || {};

  return gsap.fromTo(
    element,
    { opacity },
    {
      opacity: 1,
      duration: dur,
      delay: del,
      stagger: st,
      ease: 'power2.out',
    }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (element: Element, options?: {
  scale?: number;
  duration?: number;
  delay?: number;
}) => {
  const {
    scale = 0.9,
    duration: dur = 0.4,
    delay: del = 0,
  } = options || {};

  return gsap.fromTo(
    element,
    { scale, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: dur,
      delay: del,
      ease: 'back.out(1.7)',
    }
  );
};

/**
 * Stagger reveal for grid items
 */
export const staggerReveal = (items: Element[], options?: {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
}) => {
  const {
    y = 60,
    opacity = 0,
    duration: dur = 0.6,
    stagger: st = 0.08,
  } = options || {};

  return gsap.fromTo(
    items,
    { y, opacity },
    {
      y: 0,
      opacity: 1,
      duration: dur,
      stagger: st,
      ease: 'power3.out',
    }
  );
};

/**
 * Number counter animation
 */
export const animateCounter = (element: Element, target: number, options?: {
  duration?: number;
  delay?: number;
}) => {
  const {
    duration: dur = 1.5,
    delay: del = 0,
  } = options || {};

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: target,
    duration: dur,
    delay: del,
    ease: 'power2.out',
    onUpdate: () => {
      (element as HTMLElement).textContent = Math.round(obj.value).toString();
    },
  });
};

/**
 * Progress bar animation
 */
export const animateProgress = (element: Element, target: number, options?: {
  duration?: number;
  delay?: number;
  ease?: string;
}) => {
  const {
    duration: dur = 1,
    delay: del = 0,
    ease: easeFn = 'power3.out',
  } = options || {};

  return gsap.fromTo(
    element,
    { width: '0%' },
    {
      width: `${Math.min(target, 100)}%`,
      duration: dur,
      delay: del,
      ease: easeFn,
    }
  );
};

/**
 * Completion celebration animation
 */
export const celebrate = (element: Element) => {
  const tl = gsap.timeline();

  // Burst effect
  tl.to(element, {
    scale: 1.2,
    duration: 0.15,
    ease: 'power2.out',
  })
    .to(element, {
      scale: 1,
      duration: 0.2,
      ease: 'elastic.out(1, 0.5)',
    });

  return tl;
};

/**
 * Card hover lift effect
 */
export const cardHover = (element: Element, direction: 'enter' | 'leave') => {
  if (direction === 'enter') {
    return gsap.to(element, {
      y: -4,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
    });
  }
  return gsap.to(element, {
    y: 0,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    duration: 0.3,
    ease: 'power2.in',
  });
};

/**
 * Button press effect
 */
export const buttonPress = (element: Element) => {
  const tl = gsap.timeline();

  tl.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in',
  })
    .to(element, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    });

  return tl;
};

/**
 * Scroll-triggered fade up
 */
export const scrollFadeUp = (element: Element, options?: {
  y?: number;
  opacity?: number;
  start?: string;
}) => {
  const {
    y = 60,
    opacity = 0,
    start = 'top 85%',
  } = options || {};

  gsap.set(element, { y, opacity });

  ScrollTrigger.create({
    trigger: element,
    start,
    once: true,
    onEnter: () => {
      gsap.to(element, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
      });
    },
  });
};

/**
 * Staggered scroll reveal for containers
 */
export const scrollStaggerReveal = (container: Element, selector: string, options?: {
  y?: number;
  opacity?: number;
  start?: string;
  stagger?: number;
}) => {
  const {
    y = 60,
    opacity = 0,
    start = 'top 80%',
    stagger: st = 0.1,
  } = options || {};

  const items = Array.from(container.querySelectorAll(selector));
  gsap.set(items, { y, opacity });

  ScrollTrigger.create({
    trigger: container,
    start,
    once: true,
    onEnter: () => {
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: st,
        ease: 'power3.out',
      });
    },
  });
};

/**
 * Text reveal animation
 */
export const textReveal = (element: Element, options?: {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
}) => {
  const {
    direction = 'up',
    distance = 30,
    duration: dur = 0.6,
  } = options || {};

  const fromProps: Record<string, number> = { opacity: 0 };
  const toProps: Record<string, number> = { opacity: 1 };

  switch (direction) {
    case 'up':
      fromProps.y = distance;
      toProps.y = 0;
      break;
    case 'down':
      fromProps.y = -distance;
      toProps.y = 0;
      break;
    case 'left':
      fromProps.x = distance;
      toProps.x = 0;
      break;
    case 'right':
      fromProps.x = -distance;
      toProps.x = 0;
      break;
  }

  return gsap.fromTo(element, fromProps, {
    ...toProps,
    duration: dur,
    ease: 'power3.out',
  });
};

/**
 * Cleanup all ScrollTrigger instances
 */
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger: { kill(): void }) => trigger.kill());
};
