import React, { ReactNode, useEffect, useState } from "react";
import { animated, easings, useSpring, useTransition } from "@react-spring/web";
import {
  Light as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import docco from "react-syntax-highlighter/dist/esm/styles/hljs/docco";

SyntaxHighlighter.registerLanguage("javascript", js);

const FadeIn = ({ isVisible, children }: any) => {
  const styles = useSpring({
    opacity: isVisible ? 1 : 0,
    y: isVisible ? 0 : 24,
  });

  return <animated.div style={styles}>{children}</animated.div>;
};

const getMoveRightStyles = () =>
  useSpring({
    from: {
      x: 0,
    },
    to: {
      x: window.screen.availWidth,
    },
    config: {
      duration: 10000,
    },
  });

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

export interface AnimatedCodeProps extends SyntaxHighlighterProps {
  children: ReactNode;
}

function AnimatedCode({
  children,
  ...syntaxHighlighterProps
}: AnimatedCodeProps) {
  // console.log("🚀 ~ file: AnimatedCode.tsx ~ line 40 ~ children", children);
  const [isVisible, setIsVisible] = useState(false);
  const individualTextElementsRefs = React.useRef<any[]>([]);
  const rightmostRefs = React.useRef<any[]>([]);
  const codeLines = getCodeLines(children);
  const [elementsToFitWindow, setElementsToFitWindow] = useState<{
    [f: number]: number;
  }>({});
  // console.log("🚀 ~ file: AnimatedCode.tsx ~ line 48 ~ codeLines", codeLines);

  useEffect(() => {
    console.log(
      "🚀 ~ file: AnimatedCode.tsx ~ line 97 ~ elementsToFitWindow",
      elementsToFitWindow
    );
  }, [elementsToFitWindow]);

  useEffect(() => {
    individualTextElementsRefs.current.forEach((element) =>
      console.log(
        `Element text "${element.innerText}", width: ${element.offsetWidth}`
      )
    );

    const _elementsToFitWindow = individualTextElementsRefs.current.map(
      (element) => {
        return Math.ceil(window.innerWidth / element.offsetWidth);
      }
    );
    setElementsToFitWindow(_elementsToFitWindow);
    const intervalID = setInterval(() => {
      if (!rightmostRefs.current[0].getBoundingClientRect) return
      const { left } = rightmostRefs.current[0].getBoundingClientRect()
      if (left >= window.innerWidth) {
        console.log('The end has been reached')
      }
    }, 100)
    return () => clearInterval(intervalID)
  }, []);

  const handleOnClick = () => {
    setIsVisible(!isVisible);
  };
  const logRef = () =>
    console.log(
      "[AnimatedCode][logRef] ref",
      individualTextElementsRefs
    );
  const logRightmostRef = () =>
    console.log(
      "[AnimatedCode][logRightmostRef] rightmostRefs",
      rightmostRefs
    );
  const logRightmostRefBoundingRect = () =>
    console.log(
      "[AnimatedCode][logRightmostRef] rightmostRefs[0].getBoundingClientRect()",
      rightmostRefs.current[0].getBoundingClientRect()
    );
  return (
    <div>
      {/* <FadeIn isVisible={isVisible}>Hola</FadeIn> */}
      <div style={{overflow: 'hidden'}}>
        {codeLines?.map(({ text, ..._syntaxHighlighterProps }, i) => {
          console.log("[codeLines][map] i:", i);
          console.log(
            "[codeLines][map] elementsToFitWindow[i]:",
            elementsToFitWindow[i]
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
          if (elementsToFitWindow[i]) {
            for (let j = 0; j < elementsToFitWindow[i] - 1; j++) {
              totalTextElements.push(
                React.cloneElement(IndividualTextElement, { key: j })
              );
            }
          }
          // console.log("🚀 ~ file: AnimatedCode.tsx ~ line 108 ~ {codeLines?.map ~ individualTextElement", IndividualTextElement)
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
      <div style={{ ...(isVisible && moveRightStyle) }}>Hola</div>
      <button onClick={handleOnClick}>Change</button>
      <button onClick={logRef}>Log REF</button>
      <button onClick={logRightmostRef}>Log Rightmost REF</button>
      <button onClick={logRightmostRefBoundingRect}>Log Rightmost REF getBoundingClientRect</button>
      {/* {codeLines?.map(({ text, ..._syntaxHighlighterProps }, i) => (
        <SyntaxHighlighter
          key={i}
          language={"javascript"}
          style={docco}
          customStyle={{
            backgroundColor: "white",
          }}
          {...syntaxHighlighterProps}
          {..._syntaxHighlighterProps}
        >
          {text}
        </SyntaxHighlighter>
      ))} */}
    </div>
  );
}

export default AnimatedCode;

const moveRightStyle = {
  transform: `translateX(${window.screen.availWidth}px)`,
  transition: `transform ${(35 * window.screen.availWidth) / 1920}s linear`,
};

const moveLeftStyle = {
  transform: `translateX(-${window.screen.availWidth}px)`,
  transition: `transform ${(35 * window.screen.availWidth) / 1920}s linear`,
};
