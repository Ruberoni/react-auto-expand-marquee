import React, { ReactNode, useEffect, useState } from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import "./AnimatedCode.css";
import {
  getClonesComponentsArray,
  getCodeLines,
  getHowManyFitIn,
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
  mix: false
}

/**
 * @todo
 * - [X] [DONE] Make it work with any parent component
 * - [X] [DONE] Have two rows moving
 * - [X] [DONE] Every row moves at the same speed.
 * - [X] [DONE] Achieve infite loop
 * - Move rows interleaved
 * - Adjust when parent width changes
 *
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
  // console.log("🚀 ~ file: AnimatedCode.tsx ~ line 40 ~ children", children);
  const [play, setPlay] = useState(false);
  /**
   * Will store the main text refs of each row.\
   * Later used to calculate how many will fit in the container
   */
  const individualTextElementsRefs = React.useRef<HTMLElement[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const rowItemsRefs = React.useRef<HTMLDivElement[]>([]);
  const codeLines = getCodeLines(children);
  /**
   * Will store the minimun amount of `individualTextElementsRefs` elements that
   * each row has to have, to fullfil all the container width\
   * Each index. corresponds to each row.
   * @example `elementsToFitContainer[1] corresponds to the row 1 (one)`
   */
  const [elementsToFitContainer, setElementsToFitContainer] = useState<
    number[]
  >([]);
  // console.log("🚀 ~ file: AnimatedCode.tsx ~ line 48 ~ codeLines", codeLines);

  // TESTING
  useEffect(() => {
    console.log(
      "🚀 ~ file: AnimatedCode.tsx ~ line 97 ~ elementsToFitContainer",
      elementsToFitContainer
    );
  }, [elementsToFitContainer]);

  useEffect(() => {
    if (containerRef.current) {
      // START TESTING
      individualTextElementsRefs.current.forEach((element) =>
        console.log(
          `Element text "${element.innerText}", width: ${element.offsetWidth}`
        )
      );
      // END TESTING

      const _elementsToFitContainer = individualTextElementsRefs.current.map(
        (element) => {
          if (!containerRef.current) return 0; // <- Dont know why TS gives error without this line
          return getHowManyFitIn(element, containerRef.current);
        }
      );

      setElementsToFitContainer(_elementsToFitContainer);
    }
  }, []);

  const handleOnClick = () => {
    setPlay(!play);
  };
  // START TESTING
  const logRef = () =>
    console.log("[AnimatedCode][logRef] ref", individualTextElementsRefs);
  const logRowItemsRefs = () =>
    console.log("[AnimatedCode][logRowItemsRefs] rowItemsRefs", rowItemsRefs);
  const loglogRowItemsRefsBoundingRect = () =>
    console.log(
      "[AnimatedCode][loglogRowItemsRefsBoundingRect] rowItemsRefs[0].getBoundingClientRect()",
      rowItemsRefs.current[0].getBoundingClientRect()
    );
  // END TESTING
  return (
    <div>
      <div className="container" ref={containerRef}>
        {codeLines?.map(({ text, ..._syntaxHighlighterProps }, i) => {
          const IndividualTextElement = (
            <p
              ref={(ref) => {
                if (!ref) return;
                individualTextElementsRefs.current[i] = ref;
              }}
            >
              {text}
            </p>
          );

          const totalTextElements = elementsToFitContainer[i]
            ? getClonesComponentsArray(IndividualTextElement, elementsToFitContainer[i] - 1)
            : [IndividualTextElement]

          const reverse = animationConfig.mix && Boolean(i % 2 === 0)

          const scrollAnimationStyles = getScrollAnimationStyles(
            rowItemsRefs.current[i],
            play,
            {
              reverse
            }
          );

          // eslint-disable-next-line react/display-name
          const RowItem = React.forwardRef<HTMLDivElement>((props, ref) => (
            <div
              style={{
                display: "flex",
                flex: "0 0 auto",
                width: "max-content",
                
                ...scrollAnimationStyles,
              }}
              ref={ref}
              {...props}
            >
              {totalTextElements.map((el) => el)}
            </div>
          ));

          return (
            <div className="row" style={reverse ? {flexDirection: 'row-reverse',} : {}} key={i}>
              <RowItem
                ref={(ref) => {
                  if (!ref) return;
                  rowItemsRefs.current[i] = ref;
                }}
              />
              <RowItem />
            </div>
          );
        })}
      </div>
      {/* START TESTING */}
      <button onClick={handleOnClick}>Change</button>
      <button onClick={logRef}>Log REF</button>
      <button onClick={logRowItemsRefs}>Log Rightmost REF</button>
      <button onClick={loglogRowItemsRefsBoundingRect}>
        Log Rightmost REF getBoundingClientRect
      </button>
      {/* END TESTING */}
    </div>
  );
}

export default AnimatedCode;
