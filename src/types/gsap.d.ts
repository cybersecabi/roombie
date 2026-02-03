declare module 'gsap' {
  export interface GSAPTimeline {
    to(target: any, vars: any, position?: string | number): GSAPTimeline;
    from(target: any, vars: any, position?: string | number): GSAPTimeline;
    fromTo(target: any, fromVars: any, toVars: any, position?: string | number): GSAPTimeline;
    play(): GSAPTimeline;
    pause(): GSAPTimeline;
    kill(): void;
  }

  export interface GSAPTween {
    kill(): void;
    pause(): GSAPTween;
    play(): GSAPTween;
    restart(): GSAPTween;
    reverse(): GSAPTween;
  }

  export const gsap: {
    registerPlugin(...plugins: any[]): void;
    to(target: any, vars: any): GSAPTween;
    from(target: any, vars: any): GSAPTween;
    fromTo(target: any, fromVars: any, toVars: any): GSAPTween;
    timeline(vars?: any): GSAPTimeline;
    set(target: any, vars: any): void;
    getProperty(target: any, property: string): any;
    utils: {
      toArray(target: any): any[];
      random(min: number, max: number): number;
      snap(snapTo: number | any[], valueToSnap: number): number;
    };
  };

  export { gsap as default };
}

declare module 'gsap/ScrollTrigger' {
  export interface ScrollTriggerInstance {
    kill(): void;
    refresh(): void;
  }

  export interface ScrollTriggerStatic {
    create(vars: any): ScrollTriggerInstance;
    refresh(): void;
    getAll(): ScrollTriggerInstance[];
    kill(): void;
  }

  export const ScrollTrigger: ScrollTriggerStatic;
  export { ScrollTrigger as default };
}

declare module 'gsap/dist/gsap' {
  export * from 'gsap';
}
