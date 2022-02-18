import React, { ReactNode, useEffect, useState } from "react";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage("javascript", js);

const SPEED_CONSTANT = 35 / 1920; // ~ 0.01823

/**
 * Returns only the components that are strings
 */
function getStringComponentsOrChildren(components: ReactNode) {
  if (typeof components === "string") return [components];
  if (Array.isArray(components)) {
    return components?.filter(
      (comp) =>
        typeof comp.props?.children === "string" || typeof comp === "string"
    );
  }
  return [];
}

export interface ICodeLine extends SyntaxHighlighterProps {
  text: string;
}

/**
 * Transforms a component into ICodeLines[]
 */
const getCodeLines = (
  component: ReactNode | string
): ICodeLine[] | undefined => {
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
};

function getHowManyFitIn(base: HTMLElement, target: HTMLElement) {
  const { width: targetWidth } = target.getBoundingClientRect();
  return Math.ceil(targetWidth / base.offsetWidth);
}
export interface AnimatedCodeProps extends SyntaxHighlighterProps {
  children: ReactNode;
}

/**
 * @todo
 * - [X] [DONE] Make it work with any parent component
 * - Have two rows moving simultaneously
 * - Achieve infite loop
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
  const [isVisible, setIsVisible] = useState(false);
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

  const moveRightStyle = getMoveRightStyles(containerRef.current)

  // TESTING
  useEffect(() => {
    console.log(
      "🚀 ~ file: AnimatedCode.tsx ~ line 97 ~ elementsToFitContainer",
      elementsToFitContainer
    );
  }, [elementsToFitContainer]);

  useEffect(() => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

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

      const intervalID = setInterval(() => {
        if (!rightmostRefs.current[0].getBoundingClientRect) return;
        const rightmostElementRect =
          rightmostRefs.current[0].getBoundingClientRect();
        if (rightmostElementRect.right > containerRect.width) {
          // The
        }
        if (rightmostElementRect.left >= containerRect.width) {
          // The last element is outside the container
          // Steps
          // 1. Remove it
          // 2. Push a new element at first position (unshift)
          console.log("The end has been reached");
        }
        //
      }, 100);
      return () => clearInterval(intervalID);
    }
  }, []);

  const handleOnClick = () => {
    setIsVisible(!isVisible);
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
      <div style={{ overflow: "hidden", width: '50%' }} ref={containerRef}>
        {codeLines?.map(({ text, ..._syntaxHighlighterProps }, i) => {
          console.log("[codeLines][map] i:", i);
          console.log(
            "[codeLines][map] elementsToFitContainer[i]:",
            elementsToFitContainer[i]
          );
          const IndividualTextElement = React.createElement(
            "p",
            {
              ref: (ref) => {
                if (!ref) return;
                individualTextElementsRefs.current[i] = ref;
              },
              style: {
                // visibility: "hidden",
                // display: 'none',
                width: "fit-content",
              },
            },
            text
          );
          const totalTextElements = [];
          if (elementsToFitContainer[i]) {
            for (let j = 0; j < elementsToFitContainer[i] - 1; j++) {
              totalTextElements.push(
                React.cloneElement(IndividualTextElement, { key: j })
              );
            }
          }
          return (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  width: "max-content",
                  ...(isVisible && moveRightStyle),
                }}
                ref={(ref) => {
                  if (!ref) return;
                  rightmostRefs.current[i] = ref;
                }}
              >
                {IndividualTextElement} {totalTextElements.map((el) => el)}
              </div>
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

const getMoveRightStyles = (container: HTMLElement | null) => {
  if (!container) return {}
  const { width: containerWidth } = container.getBoundingClientRect();
  return {
    transform: `translateX(${containerWidth}px)`,
    transition: `transform ${SPEED_CONSTANT * containerWidth}s linear`,
  };
};
