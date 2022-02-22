import React, { ReactNode, useEffect, useState } from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import "./AnimatedCode.css";
import {
  getCodeLines,
  getHowManyFitIn,
  getScrollAnimationStyles,
} from "./utils";

SyntaxHighlighter.registerLanguage("javascript", js);

export interface AnimatedCodeProps extends SyntaxHighlighterProps {
  children: ReactNode;
}

/**
 * @todo
 * - [X] [DONE] Make it work with any parent component
 * - [X] [DONE] Have two rows moving
 * - [X] [DONE] Every row moves at the same speed.
 * - [X] [DONE] Achieve infite loop
 * - Move each row independently
 * - Adjust when parent width changes
 *
 * - Use SyntaxHighlighter
 * - [Maybe] change this component name to AnimatedText (or similiar)
 * and make it only work in its most simpler way with plain text, but sufficiently
 * customizable to be able to change the text renderer component so I can use SyntaxHighlighter.
 * Then make a wrapper component with SyntaxHighlighter
 *
 */
function AnimatedCode({
  children,
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

  const rightmostRefs = React.useRef<HTMLDivElement[]>([]);
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
  const logRightmostRef = () =>
    console.log("[AnimatedCode][logRightmostRef] rightmostRefs", rightmostRefs);
  const logRightmostRefBoundingRect = () =>
    console.log(
      "[AnimatedCode][logRightmostRef] rightmostRefs[0].getBoundingClientRect()",
      rightmostRefs.current[0].getBoundingClientRect()
    );
  // END TESTING
  return (
    <div>
      <div className="container" ref={containerRef}>
        {codeLines?.map(({ text, ..._syntaxHighlighterProps }, i) => {
          console.log("[codeLines][map] i:", i);
          console.log(
            "[codeLines][map] elementsToFitContainer[i]:",
            elementsToFitContainer[i]
          );
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

          const totalTextElements: React.ReactElement[] = [];
          if (elementsToFitContainer[i]) {
            for (let j = 0; j < elementsToFitContainer[i] - 1; j++) {
              totalTextElements.push(
                React.cloneElement(IndividualTextElement, { key: j })
              );
            }
          }

          const scrollAnimationStyles = getScrollAnimationStyles(
            rightmostRefs.current[i],
            play
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
              {IndividualTextElement} {totalTextElements.map((el) => el)}
            </div>
          ));

          return (
            <div className="row" key={i}>
              <RowItem
                ref={(ref) => {
                  if (!ref) return;
                  rightmostRefs.current[i] = ref;
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
      <button onClick={logRightmostRef}>Log Rightmost REF</button>
      <button onClick={logRightmostRefBoundingRect}>
        Log Rightmost REF getBoundingClientRect
      </button>
      {/* END TESTING */}
    </div>
  );
}

export default AnimatedCode;
