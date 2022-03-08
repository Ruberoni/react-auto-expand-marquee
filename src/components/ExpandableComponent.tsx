import React, { ReactNode, useState, ReactElement, useEffect, ForwardedRef } from "react";
import useCompsToFillContainer from "../hooks/useCompsToFillContainer";
import { getClonesComponentsArray } from "../utils";
import RowItem from "./RowItem";

export interface ExpandableComponentProps extends React.HTMLProps<HTMLDivElement>{
  children: ReactNode;
  /**
   * Use this to duplicate even more this component.
   */
  duplicateTimes?: number;
  rowStyle?: (w: number) => React.CSSProperties;
}

const _ExpandableComponent = (({
  children,
  duplicateTimes = 1,
  rowStyle,
  ...props
}: ExpandableComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
  const [,setReady] = useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);
  const rowItemRef = React.useRef<HTMLElement>();
  const [rowItemSize, setRowItemSize] = useState(0)
  const [components, setComponents] = useState<null | ReactElement[]>(null);
  
  useEffect(() => {
    if (!rowItemSize) {
      setRowItemSize(rowItemRef.current?.getBoundingClientRect().width as number)
    }
  })

  const numberToFillContainer = useCompsToFillContainer(
    textRef.current,
    containerRef.current,
  );

  useEffect(() => {
    setReady(true)
  }, [])
    
  useEffect(() => {
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
              ref={(r) => {
                if (r && !rowItemRef.current) rowItemRef.current = r
                return ref
              }}
            >
              {[
                i === 0 && (
                  <InlineChildren InlineChildren={children} key="base" ref={textRef} />
                ),
                ...getClonesComponentsArray(
                  <InlineChildren InlineChildren={children} />,
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
        ? components.map(comp => React.cloneElement(comp, {style: rowStyle?.(rowItemRef.current?.getBoundingClientRect().width as number)}))
        : <InlineChildren InlineChildren={children} ref={textRef} />}
    </div>
  );
});

/**
 * Component that expand itself to the container width.
 * The expands is done copying itself a lot of times
 *
 * @todo
 * - Implement to work with any component
 */
const ExpandableComponent = React.forwardRef(_ExpandableComponent);
export default ExpandableComponent

interface InlineChildrenProps extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  InlineChildren: ReactNode
}


const _InlineChildren = ({InlineChildren, ...props}: InlineChildrenProps, ref: ForwardedRef<HTMLDivElement>) => (
  <div ref={ref} {...props}>
    {InlineChildren}
  </div>
)

/**
 * A helper component to simply pass the `children` as a inline props instead of the usual way and
 * render in a `div`.
 */
const InlineChildren = React.forwardRef(_InlineChildren)