import React, { ReactElement, ReactNode } from "react";
import { SyntaxHighlighterProps } from "react-syntax-highlighter";

const SPEED_CONSTANT = 35 / 1920; // ~ 0.01823

export interface ICodeLine extends SyntaxHighlighterProps {
  text: string;
}

export interface IAnimationStylesConfig {
  reverse?: boolean;
  play?: boolean;
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
 */
export function getHowManyFitIn(base: HTMLElement, target: HTMLElement) {
  const { width: targetWidth } = target.getBoundingClientRect();
  const { width: baseWidth } = base.getBoundingClientRect();
  if (baseWidth < 1) throw new Error("[getHowManyFitIn] `baseWidth` cannot be smaller than 1");
  return Math.ceil(targetWidth / baseWidth);
}

const defaultAnimationStylesConfig: IAnimationStylesConfig = {
  reverse: false,
  play: false
}

export function getScrollAnimationStyles(
  container: HTMLElement | null | number,
  config = defaultAnimationStylesConfig
): React.CSSProperties {
  if (!container) return {};
  const { width: containerWidth } = typeof container === 'number' ? {width: container} : container.getBoundingClientRect();
  return {
    animationName: config.reverse ? 'scrollReverse' : 'scroll',
    animationDuration: SPEED_CONSTANT * containerWidth + 's',
    animationPlayState: config.play ? "running" : "paused",

    animationTimingFunction: 'linear',
    animationDelay: '0',
    animationIterationCount: 'infinite',
    animationDirection: "normal",
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
