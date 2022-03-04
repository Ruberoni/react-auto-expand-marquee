import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import "./AnimatedCode.css";
import ExpandableComponent from "./components/ExpandableComponent";
import Row from "./components/Row";
import {
  getClonesComponentsArray,
  getCodeLines,
  getHowManyFitIn,
  getScrollAnimationStyles,
  IAnimationStylesConfig,
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
  const [play, setPlay] = useState(false);
  const [rendered, setRendered] = useState(false);
  /**
   * Will store the main text refs of each row.\
   * Later used to calculate how many will fit in the container
   */
  const individualTextElementsRefs = React.useRef<HTMLElement[]>([]);
  const [baseRowItemsWidth, setBaseRowItemsWidth] = useState<number[]>([]);
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

  const _getScrollAnimationStyles = (el: any, config: IAnimationStylesConfig) => getScrollAnimationStyles(el, {
    play,
    ...config
  });

  function calculateRowsWidth() {
    console.log(
      "🚀 ~ file: AnimatedCode.tsx ~ line 80 ~ calculateRowsWidth ~ baseRowItemsWidth",
      baseRowItemsWidth
    );
    const _elementsToFitContainer = baseRowItemsWidth.map(
      (baseRowItemWidth) => {
        if (!containerRef.current) {
          return 0;
        }
        const { width: targetWidth } =
          containerRef.current.getBoundingClientRect();
        return Math.ceil(targetWidth / baseRowItemWidth);
      }
    );
    setElementsToFitContainer(_elementsToFitContainer);
  }

  useEffect(() => {
    console.log("FIRST RENDER");
    baseRowItemsWidth[0] ||
      setBaseRowItemsWidth(
        individualTextElementsRefs.current.map(
          (element) => element.getBoundingClientRect().width
        )
      );
  }, []);

  useEffect(() => {
    console.log("RENDER");
    setRendered(true);

    window.addEventListener("resize", calculateRowsWidth);
    return () => {
      window.removeEventListener("resize", calculateRowsWidth);
    };
  });

  useEffect(() => {
    calculateRowsWidth();
  }, [baseRowItemsWidth]);

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
      {/* {rendered && <h1>First render</h1>} */}
      <div className="container" ref={containerRef}>
        {codeLines?.map(({ text }, i) => {
          const reverse = animationConfig.mix && Boolean(i % 2 === 0);

          const scrollAnimationStyles = _getScrollAnimationStyles(
            rowItemsRefs.current[i],
            {
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
      <button onClick={logRef}>Log REF</button>
      <button onClick={logRowItemsRefs}>Log Rightmost REF</button>
      <button onClick={loglogRowItemsRefsBoundingRect}>
        Log Rightmost REF getBoundingClientRect
      </button>
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



