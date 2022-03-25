import React, { ReactElement, ReactNode } from "react";
import { SyntaxHighlighterProps } from "react-syntax-highlighter";

const SPEED_CONSTANT = 35 / 1920; // ~ 0.01823

export interface ICodeLine extends SyntaxHighlighterProps {
  text: string;
}


/**
 * Returns only the components that are strings
 */
export function getStringComponentsOrChildren(components: ReactNode) {
  if (typeof components === "string") return [components];
  if (Array.isArray(components)) {
    return components?.filter(
      (comp) =>
        typeof comp.props?.children === "string" || typeof comp === "string"
    );
  }
  return [];
}

/**
 * Transforms a component into ICodeLines[]
 * @unused
 */
export function getCodeLines(
  component: ReactNode | string
): ICodeLine[] | undefined {
  if (typeof component === "string") {
    return component.split("\n").map((text) => ({
      text,
    }));
  } else if (
    React.isValidElement(component) &&
    typeof component.props.children === "string"
    ) {
      return component.props.children.split("\n").map((text: string) => ({
        text,
        ...component.props,
      }));
    }

  if (Array.isArray(component)) {
    const stringComponents = getStringComponentsOrChildren(component);

    const codeLines: ICodeLine[] = [];
    stringComponents.forEach((comp) => {
      const thisCodeLines = getCodeLines(comp);
      if (thisCodeLines) codeLines.push(...thisCodeLines);
    });
    return codeLines;
  }
}

/**
 * Returns how many `base` elements fits in `target` element
 * @unused
 */
export function getHowManyFitIn(base: HTMLElement, target: HTMLElement) {
  const { width: targetWidth } = target.getBoundingClientRect();
  const { width: baseWidth } = base.getBoundingClientRect();
  if (baseWidth < 1) throw new Error("[getHowManyFitIn] `baseWidth` cannot be smaller than 1");
  return Math.ceil(targetWidth / baseWidth);
}
export interface IAnimationStylesConfig {
  /**
   * Controls if the animation will go from right to left
   */
  reverse: boolean;
  /**
   * Controls if the animation is running or not
   */
  play: boolean;
  /**
   * Controls de animation speed
   */
  speed: number;
  delay: number;
  timingFunction: React.CSSProperties['animationTimingFunction'];
  iterationCount: React.CSSProperties['animationIterationCount'];
  direction: React.CSSProperties['animationDirection'];
}

const defaultAnimationStylesConfig: IAnimationStylesConfig = {
  reverse: false,
  play: false,
  speed: SPEED_CONSTANT,
  timingFunction: 'linear',
  delay: 0,
  iterationCount: 'infinite',
  direction: 'normal'
}

export function getScrollAnimationStyles(
  container: HTMLElement | null | number,
  config: Partial<IAnimationStylesConfig>
): React.CSSProperties {
  if (!container) return {};
  const { width: containerWidth } = typeof container === 'number' ? {width: container} : container.getBoundingClientRect();
  
  const _config = {
    ...defaultAnimationStylesConfig,
    ...config
  }
  
  return {
    animationName: _config.reverse ? 'scrollReverse' : 'scroll',
    animationDuration: _config.speed * containerWidth + 's',
    animationPlayState: _config.play ? "running" : "paused",

    animationTimingFunction: _config.timingFunction,
    animationDelay: _config.delay.toString(),
    animationIterationCount: _config.iterationCount,
    animationDirection: _config.direction,
  };
}

/**
 * Returns an array of *`length`* elements *`el`* 
 */
export function getClonesComponentsArray(el: ReactElement, length: number, keySuffix: string) {
  if (length < 1) return []
  return Array.from(Array(length))
    .map((_, i) => React.cloneElement(el, { key: `${keySuffix}-${i}` }));
}
