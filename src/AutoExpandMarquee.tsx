import React, { ReactNode } from "react";
import "./AutoExpandMarquee.css";
import ExpandableComponent from "./components/ExpandableComponent";
import { getScrollAnimationStyles, IAnimationStylesConfig } from "./utils";

export interface IMarqueeAnimationConfig extends Partial<IAnimationStylesConfig> {
  mix: boolean;
}
export interface AutoExpandMarqueeProps {
  children: ReactNode;
  animationConfig?: Partial<IMarqueeAnimationConfig>;
  style: React.CSSProperties;
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
  animationConfig,
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
