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
  mix: false,
};

/**
 * @todo
 * - [BUG] Changing window size doesnt update speed
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
  const [play, setPlay] = useState(true);
  const [rendered, setRendered] = useState(false);
  /**
   * Will store the main text refs of each row.\
   * Later used to calculate how many will fit in the container
   */
  const individualTextElementsRefs = React.useRef<HTMLElement[]>([]);
  const [baseRowItemsWidth, setBaseRowItemsWidth] = useState<number[]>([])
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

  function calculateRowsWidth() {
    const _elementsToFitContainer = baseRowItemsWidth.map(
      (baseRowItemWidth) => {
        if (!containerRef.current) {
          return 0
        }
        const { width: targetWidth } = containerRef.current.getBoundingClientRect();
        return Math.ceil(targetWidth / baseRowItemWidth);
      }
    );
    setElementsToFitContainer(_elementsToFitContainer);
  }

  useEffect(() => {
    setBaseRowItemsWidth(individualTextElementsRefs.current.map(
      (element) => element.getBoundingClientRect().width
    ))
  }, [])

  useEffect(() => {
    setRendered(true);
    
    window.addEventListener("resize", calculateRowsWidth);
    return () => {
      window.removeEventListener("resize", calculateRowsWidth);
    };
  });

  useEffect(() => {
    calculateRowsWidth();
  }, [baseRowItemsWidth])

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
      {rendered && <h1>First render</h1>}
      <div className="container" ref={containerRef}>
        {codeLines?.map(({ text }, i) => {
          const reverse = animationConfig.mix && Boolean(i % 2 === 0);

          const scrollAnimationStyles = getScrollAnimationStyles(
            rowItemsRefs.current[i],
            {
              play,
              reverse,
            }
          );
          return (
            <Row
              key={i}
              text={text}
              textsAmount={elementsToFitContainer[i]}
              style={scrollAnimationStyles}
              textElementRef={(ref) => {
                if (!ref) return;
                individualTextElementsRefs.current[i] = ref;
              }}
              rowItemRef={(ref) => {
                if (!ref) return;
                rowItemsRefs.current[i] = ref;
              }}
              containerProps={{
                style: reverse ? { flexDirection: "row-reverse" } : {},
              }}
            />
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

const RowItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, ...divProps }, ref) => (
  <div
    {...divProps}
    style={{
      display: "flex",
      flex: "0 0 auto",
      width: "max-content",
      ...divProps.style,
    }}
    ref={ref}
  >
    {children}
  </div>
));

RowItem.displayName = "RowItem";

export interface CodeLineProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "ref"> {
  textElementRef: React.ClassAttributes<HTMLParagraphElement>["ref"];
  rowItemRef: React.Ref<HTMLDivElement>;
  text: string;
  textsAmount: number;
  containerProps: React.HTMLProps<HTMLDivElement>;
}

/**
 * Renders 2 `RowItem`, one besides the other, in a container that doesn't break.\
 * Each `RowItem` has `textsAmount` elements with `text`.
 */
const Row = ({
  text,
  textsAmount,
  containerProps,
  textElementRef,
  rowItemRef,
  ...divProps
}: CodeLineProps) => {
  const [state, setState] = useState<null | React.ReactElement[][]>(null);

  const IndividualTextElement = <p ref={textElementRef}>{text}</p>;
  useEffect(() => {
    if (textsAmount) {
      setState([
        [IndividualTextElement, ...getClonesComponentsArray(
          <p>{text}</p>,
          textsAmount - 1,
          "row-1"
        )],
        getClonesComponentsArray(
          <p>{text}</p>,
          textsAmount,
          "row-2"
        ),
        getClonesComponentsArray(
          <p>{text}</p>,
          textsAmount,
          "row-3"
        ),
      ]);
    }
  }, [textsAmount]);

  return (
    <div className="row" {...containerProps}>
      {!state ? (
        IndividualTextElement
      ) : (
        <>
          <RowItem ref={rowItemRef} {...divProps}>
            {state[1]}
          </RowItem>
          <RowItem {...divProps}>{state[2]}</RowItem>
        </>
      )}
    </div>
  );
};

export default AnimatedCode;
