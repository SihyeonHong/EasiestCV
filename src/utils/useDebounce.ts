import { useRef, useCallback, useEffect } from "react";

export default function useDebounce<T extends unknown[]>(
  callback: (...args: T) => void | Promise<void>,
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );
}
