import React, {
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import "./AnimatedCode.css";
import ExpandableComponent from "./components/ExpandableComponent";
import {
  getCodeLines,
  getScrollAnimationStyles,
} from "./utils";

SyntaxHighlighter.registerLanguage("javascript", js);

export interface IAnimationConfig {
  mix: boolean;
}
export interface AnimatedCodeProps extends SyntaxHighlighterProps {
  children: ReactNode;
  animationConfig?: IAnimationConfig;
}

const defaultAnimationConfig: IAnimationConfig = {
  mix: false,
};

/**
 * @todo
 * - Use SyntaxHighlighter
 * - [Maybe] change this component name to AnimatedText (or similiar)
 * and make it only work in its most simpler way with plain text, but sufficiently
 * customizable to be able to change the text renderer component so I can use SyntaxHighlighter.
 * Then make a wrapper component with SyntaxHighlighter
 * - Move each row independently
 *
 */
function AnimatedCode({
  children,
  animationConfig = defaultAnimationConfig,
  ...syntaxHighlighterProps
}: AnimatedCodeProps) {

  const [play, setPlay] = useState(true);
  /**
   * Will store the main text refs of each row.\
   * Later used to calculate how many will fit in the container
   */
  const codeLines = getCodeLines(children);

  const handleOnClick = () => {
    setPlay(!play);
  };
  return (
    <div>
      {codeLines?.map(({ text }, i) => {
        const reverse = animationConfig.mix && Boolean(i % 2 === 0);
        const scrollAnimationStyles = (w: number) => getScrollAnimationStyles(
          w,
          {
            play,
            reverse,
          }
        );
        
        return (
          <ExpandableComponent
            rowStyle={scrollAnimationStyles}
            key={`EC-ROOT-${i}`}
            style={{ backgroundColor: "lightblue", width: "50%", ...(reverse ? { flexDirection: "row-reverse" } :{} )}}
            duplicateTimes={2}
          >
            <p>{text}</p>
          </ExpandableComponent>
        );
      })}
      {/* START TESTING */}
      <button onClick={handleOnClick}>Change</button>
      {/* END TESTING */}
    </div>
  );
}

export interface CodeLineProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "ref"> {
  textElementRef: React.ClassAttributes<HTMLParagraphElement>["ref"];
  rowItemRef: React.Ref<HTMLDivElement>;
  text: string;
  textsAmount: number;
  containerProps: React.HTMLProps<HTMLDivElement>;
}


export default AnimatedCode;



