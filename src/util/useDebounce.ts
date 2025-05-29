import { useRef, useCallback } from "react";

const useDebounce = <T extends unknown[]>(
  callback: (...args: T) => void | Promise<void>,
  delay: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};

export default useDebounce;
