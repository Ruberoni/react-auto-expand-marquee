import React, { ReactNode } from "react";
import "./AutoExpandMarquee.css";
import ExpandableComponent from "./components/ExpandableComponent";
import { getScrollAnimationStyles, IAnimationStylesConfig } from "./utils";

export interface IMarqueeAnimationConfig extends Partial<IAnimationStylesConfig> {
  /**
   * When set to `true` each row will move to a different side
   */
  mix: boolean;
}
export interface AutoExpandMarqueeProps {
  children: ReactNode;
  /**
   * Customize the animation
   */
  animationConfig?: Partial<IMarqueeAnimationConfig>;
  /**
   * Styles to apply to the Marquee container
   */
  style?: React.CSSProperties;
}

const defaultAnimationConfig: IMarqueeAnimationConfig = {
  mix: false,
  play: true,
};

/**
 * @bug
 * - Changing windows size breaks animation speed
 */
function AutoExpandMarquee({
  children,
  animationConfig = defaultAnimationConfig,
  style,
}: AutoExpandMarqueeProps) {
  const _marqueeAnimationConfig = {
    ...defaultAnimationConfig,
    ...animationConfig,
  };

  return (
    <div style={style}>
      {React.Children.map(children, (child, i) => {
        const reverse = _marqueeAnimationConfig.mix && Boolean(i % 2 === 0);
        const scrollAnimationStyles = (w: number) =>
          getScrollAnimationStyles(w, {
            reverse,
            ..._marqueeAnimationConfig
          });

        return (
          <ExpandableComponent
            rowStyle={scrollAnimationStyles}
            key={`EC-ROOT-${i}`}
            style={reverse ? { flexDirection: "row-reverse" } : {}}
            duplicateTimes={2}
          >
            {child}
          </ExpandableComponent>
        );
      })}
    </div>
  );
}

export default AutoExpandMarquee;
