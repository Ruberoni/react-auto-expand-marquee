import React from "react";

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

export default RowItem;