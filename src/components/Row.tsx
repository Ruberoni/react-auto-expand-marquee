import React, { useState, useEffect } from "react";
import { getClonesComponentsArray } from "../utils";
import RowItem from "./RowItem";

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
 * @unused
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
        getClonesComponentsArray(<p>{text}</p>, textsAmount, "row-1"),
        getClonesComponentsArray(<p>{text}</p>, textsAmount, "row-2"),
        getClonesComponentsArray(<p>{text}</p>, textsAmount, "row-3"),
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

export default Row;
