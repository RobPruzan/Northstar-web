import { useState, useEffect, type RefObject } from "react";

export default function usePositioning(
  ref: RefObject<HTMLDivElement>,
  open: boolean
) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function updatePosition() {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = rect.top;
        let left = rect.left;

        if (rect.right > viewportWidth) {
          left -= rect.right - viewportWidth;
        }

        if (rect.bottom > viewportHeight) {
          top -= rect.bottom - viewportHeight;
        }


        setPosition({ top, left });
      }
    }

    window.addEventListener("resize", updatePosition);
    updatePosition();

    return () => window.removeEventListener("resize", updatePosition);
  }, [ref, open]);

  return position;
}
