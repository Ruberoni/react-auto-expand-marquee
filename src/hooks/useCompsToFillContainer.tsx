import { useState, useEffect } from "react";

const useCompsToFillContainer = (
  compRef: HTMLElement | null,
  containerRef: HTMLElement | null
) => {
  const [numberToFillContainer, setnumberToFillContainer] = useState(0);

  function calculateComponentsToFillContainer() {
    const targetWidth = containerRef?.getBoundingClientRect().width;
    const baseWidth = compRef?.offsetWidth;
    if (!targetWidth || !baseWidth) {
      setnumberToFillContainer(0);
      return;
    }

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