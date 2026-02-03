// Animation utilities using CSS transitions instead of GSAP
// This avoids GSAP import issues in production builds

// Easing presets for consistent motion
export const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// Duration presets (in seconds for CSS, milliseconds for JS)
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  smooth: 0.3,
  slow: 0.5,
  dramatic: 0.8,
};

/**
 * Fade up animation for elements
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
  } = options || {};

  const elements = Array.isArray(element) ? element : [element];

  elements.forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = String(opacity);
    htmlEl.style.transform = `translateY(${y}px)`;
    htmlEl.style.transition = `opacity ${dur}s ease ${del + index * 0.08}s, transform ${dur}s ease ${del + index * 0.08}s`;

    requestAnimationFrame(() => {
      htmlEl.style.opacity = '1';
      htmlEl.style.transform = 'translateY(0)';
    });
  });
};

/**
 * Fade in animation
 */
export const fadeIn = (element: Element | Element[], options?: {
  opacity?: number;
  duration?: number;
  delay?: number;
}) => {
  const {
    opacity = 0,
    duration: dur = 0.5,
    delay: del = 0,
  } = options || {};

  const elements = Array.isArray(element) ? element : [element];

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = String(opacity);
    htmlEl.style.transition = `opacity ${dur}s ease ${del}s`;

    requestAnimationFrame(() => {
      htmlEl.style.opacity = '1';
    });
  });
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

  const htmlEl = element as HTMLElement;
  htmlEl.style.opacity = '0';
  htmlEl.style.transform = `scale(${scale})`;
  htmlEl.style.transition = `opacity ${dur}s ease ${del}s, transform ${dur}s cubic-bezier(0.34, 1.56, 0.64, 1) ${del}s`;

  requestAnimationFrame(() => {
    htmlEl.style.opacity = '1';
    htmlEl.style.transform = 'scale(1)';
  });
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

  items.forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = String(opacity);
    htmlEl.style.transform = `translateY(${y}px)`;
    htmlEl.style.transition = `opacity ${dur}s ease ${index * st}s, transform ${dur}s ease ${index * st}s`;

    requestAnimationFrame(() => {
      htmlEl.style.opacity = '1';
      htmlEl.style.transform = 'translateY(0)';
    });
  });
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

  const htmlEl = element as HTMLElement;
  let startTime: number | null = null;
  let animationId: number;

  setTimeout(() => {
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (dur * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      htmlEl.textContent = Math.round(easeProgress * target).toString();

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
  }, del * 1000);

  return () => cancelAnimationFrame(animationId);
};

/**
 * Progress bar animation
 */
export const animateProgress = (element: Element, target: number, options?: {
  duration?: number;
  delay?: number;
}) => {
  const {
    duration: dur = 1,
    delay: del = 0,
  } = options || {};

  const htmlEl = element as HTMLElement;
  htmlEl.style.width = '0%';
  htmlEl.style.transition = `width ${dur}s ease ${del}s`;

  requestAnimationFrame(() => {
    htmlEl.style.width = `${Math.min(target, 100)}%`;
  });
};

/**
 * Completion celebration animation
 */
export const celebrate = (element: Element) => {
  const htmlEl = element as HTMLElement;
  htmlEl.style.transform = 'scale(1.2)';
  htmlEl.style.transition = 'transform 0.15s ease';

  setTimeout(() => {
    htmlEl.style.transform = 'scale(1)';
  }, 150);
};

/**
 * Card hover lift effect - applies CSS classes
 */
export const cardHover = (element: Element, direction: 'enter' | 'leave') => {
  const htmlEl = element as HTMLElement;
  if (direction === 'enter') {
    htmlEl.style.transform = 'translateY(-4px)';
    htmlEl.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
  } else {
    htmlEl.style.transform = 'translateY(0)';
    htmlEl.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
  }
  htmlEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
};

/**
 * Button press effect
 */
export const buttonPress = (element: Element) => {
  const htmlEl = element as HTMLElement;
  htmlEl.style.transform = 'scale(0.95)';
  htmlEl.style.transition = 'transform 0.1s ease';

  setTimeout(() => {
    htmlEl.style.transform = 'scale(1)';
  }, 100);
};

/**
 * Scroll-triggered fade up - stub, using IntersectionObserver instead
 */
export const scrollFadeUp = (element: Element) => {
  const htmlEl = element as HTMLElement;
  htmlEl.style.opacity = '0';
  htmlEl.style.transform = 'translateY(60px)';
  htmlEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(element);
};

/**
 * Staggered scroll reveal - stub using IntersectionObserver
 */
export const scrollStaggerReveal = (container: Element, selector: string) => {
  const items = Array.from(container.querySelectorAll(selector));
  items.forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = '0';
    htmlEl.style.transform = 'translateY(60px)';
    htmlEl.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        items.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.opacity = '1';
          htmlEl.style.transform = 'translateY(0)';
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);
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

  const htmlEl = element as HTMLElement;
  let transform = '';

  switch (direction) {
    case 'up':
      transform = `translateY(${distance}px)`;
      break;
    case 'down':
      transform = `translateY(-${distance}px)`;
      break;
    case 'left':
      transform = `translateX(${distance}px)`;
      break;
    case 'right':
      transform = `translateX(-${distance}px)`;
      break;
  }

  htmlEl.style.opacity = '0';
  htmlEl.style.transform = transform;
  htmlEl.style.transition = `opacity ${dur}s ease, transform ${dur}s ease`;

  requestAnimationFrame(() => {
    htmlEl.style.opacity = '1';
    htmlEl.style.transform = 'translate(0, 0)';
  });
};

/**
 * Cleanup - no-op since we don't use ScrollTrigger anymore
 */
export const cleanupScrollTriggers = () => {
  // No-op - IntersectionObservers clean themselves up
};
