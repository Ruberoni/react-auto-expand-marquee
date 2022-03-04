import React, { ReactNode, useState, ReactElement, useEffect, ForwardedRef } from "react";
import useCompsToFillContainer from "../hooks/useCompsToFillContainer";
import { getClonesComponentsArray } from "../utils";
import RowItem from "./RowItem";

export interface ExpandableComponentProps extends React.HTMLProps<HTMLDivElement>{
  children: ReactNode;
  duplicateTimes?: number;
  rowStyle?: (w: number) => React.CSSProperties;
}

/**
 * Component that expand itself to the container width.\
 * The expands is done copying itself a lot of times
 *
 * @todo
 * - Implement to work with any component
 */
const ExpandableComponent = (({
  children,
  duplicateTimes = 1,
  rowStyle,
  ...props
}: ExpandableComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [,setReady] = useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const [components, setComponents] = useState<null | ReactElement[]>(null);
  
  const numberToFillContainer = useCompsToFillContainer(
    textRef.current,
    containerRef.current
  );

  useEffect(() => {
    setReady(true)
  }, [])
    
  useEffect(() => {
    // console.log("A")
    if (numberToFillContainer) {
      /**
       * Sets `components' to the minimun amount of components to fullfil
       * the `container width`
       * Repeat `duplicateTimes` times
       */
      setComponents(() => {
        const _components: ReactElement[] = [];
        Array.from(Array(duplicateTimes)).forEach((_, i) => {
          _components.push(
            <RowItem
              key={`EC-BASE-row-${i}`}
              ref={ref}
            >
              {[
                i === 0 && (
                  <ChildrenWrapper _children={children} key="base" ref={textRef} />
                ),
                ...getClonesComponentsArray(
                  <ChildrenWrapper _children={children} />,
                  i === 0 ? numberToFillContainer - 1 : numberToFillContainer,
                  `EC-row-${i}`
                ),
              ]}
            </RowItem>
          );
        });
        return _components;
      });
    }
  }, [numberToFillContainer]);

  return (
    <div
      {...props}
      style={{ width: "100%", ...props.style }}
      className="row"
      ref={containerRef}
    >
      {components
        ? components.map(comp => React.cloneElement(comp, {style: rowStyle?.(containerRef.current?.getBoundingClientRect().width as number)}))
        : <ChildrenWrapper _children={children} ref={textRef} />}
    </div>
  );
});

const _ExpandableComponent = React.forwardRef(ExpandableComponent);
export default _ExpandableComponent

const ChildrenWrapper = React.forwardRef(({_children, ...props}: any, ref) => (
  <div ref={ref} {...props}>
    {_children}
  </div>
))

ChildrenWrapper.displayName = "ChildrenWrapper"