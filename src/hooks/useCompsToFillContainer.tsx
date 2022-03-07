import { useState, useEffect } from "react";

/**
 * Will return the amount of `compRef` that fits in `containerRef` according to their widths.\
 * Will recalculate it when the window size changes.
 */
const useCompsToFillContainer = (
  compRef: HTMLElement | null,
  containerRef: HTMLElement | null,
  onWindowSizeChange?: () => void
) => {
  const [numberToFillContainer, setnumberToFillContainer] = useState(0);

  function calculateComponentsToFillContainer() {
    const targetWidth = containerRef?.getBoundingClientRect().width;
    const baseWidth = compRef?.offsetWidth;
    if (!targetWidth || !baseWidth) {
      setnumberToFillContainer(0);
      return;
    }
    onWindowSizeChange?.()
    setnumberToFillContainer(Math.ceil(targetWidth / baseWidth));
  }

  useEffect(() => {
    calculateComponentsToFillContainer();
  }, [containerRef, compRef]);

  useEffect(() => {
    window.addEventListener("resize", calculateComponentsToFillContainer);
    return () => {
      window.removeEventListener("resize", calculateComponentsToFillContainer);
    };
  });
  return numberToFillContainer;
};

export default useCompsToFillContainer;