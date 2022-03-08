import React, { ReactNode } from "react";
import "./AutoExpandMarquee.css";
import ExpandableComponent from "./components/ExpandableComponent";
import { getScrollAnimationStyles } from "./utils";

export interface IAnimationConfig {
  mix: boolean;
  isPlaying: boolean;
}
export interface AutoExpandMarqueeProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  animationConfig?: Partial<IAnimationConfig>;
}

const defaultAnimationConfig: IAnimationConfig = {
  mix: false,
  isPlaying: true,
};

/**
 * @bug
 * - Changing windows size breaks animation speed
 */
function AutoExpandMarquee({
  children,
  animationConfig,
  ...divProps
}: AutoExpandMarqueeProps) {
  const _animationConfig = {
    ...defaultAnimationConfig,
    ...animationConfig,
  };

  return (
    <div {...divProps}>
      {React.Children.map(children, (child, i) => {
        const reverse = _animationConfig.mix && Boolean(i % 2 === 0);
        const scrollAnimationStyles = (w: number) =>
          getScrollAnimationStyles(w, {
            play: _animationConfig.isPlaying,
            reverse,
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
