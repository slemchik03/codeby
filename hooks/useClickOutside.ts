import { RefObject, useEffect } from "react";

export  function useClickOutside(ref: RefObject<HTMLElement>, handler: () => void) {
    useEffect(
      () => {
        const listener = (e: any) => {
          // Do nothing if clicking ref's element or descendent elements
          if (!ref.current || ref.current.contains(e.target)) {
            return;
          }
          handler();
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      [ref, handler]
    );
  }