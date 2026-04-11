import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type IconifyIconAttributes = {
  icon?: string;
  width?: string | number;
  height?: string | number;
  flip?: string;
  rotate?: string | number;
  mode?: string;
  inline?: boolean;
  /**
   * Web components read the DOM `class` attribute. React 19 passes unknown
   * props through on custom elements, so allow both forms.
   */
  class?: string;
};

type IconifyIconElement = DetailedHTMLProps<
  HTMLAttributes<HTMLElement> & IconifyIconAttributes,
  HTMLElement
>;

// React 19 moved JSX out of the global namespace into React.JSX,
// so augment the `react` module's JSX namespace.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': IconifyIconElement;
    }
  }
}

// Keep the global augmentation too, for any tooling that still reads it.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': IconifyIconElement;
    }
  }
}

export {};
