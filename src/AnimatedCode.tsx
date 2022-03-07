import React, { ReactNode } from "react";
import "./AnimatedCode.css";
import ExpandableComponent from "./components/ExpandableComponent";
import { getScrollAnimationStyles } from "./utils";

export interface IAnimationConfig {
  mix: boolean;
  isPlaying: boolean;
}
export interface AnimatedCodeProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  animationConfig?: Partial<IAnimationConfig>;
}

const defaultAnimationConfig: IAnimationConfig = {
  mix: false,
  isPlaying: true,
};

/**
 * @todo
 * - [Maybe] change this component name to AnimatedText (or similiar)
 * and make it only work in its most simpler way with plain text, but sufficiently
 * customizable to be able to change the text renderer component so I can use SyntaxHighlighter.
 * Then make a wrapper component with SyntaxHighlighter
 *
 * @bug
 * - Changing windows size breaks animation speed
 */
function AnimatedCode({
  children,
  animationConfig,
  ...divProps
}: AnimatedCodeProps) {
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

export default AnimatedCode;
