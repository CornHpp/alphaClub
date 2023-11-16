import { useState, useEffect } from "react";

const useDebounce = (callback: (value: string) => void, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      callback(debouncedValue);
    }, delay);

    return () => {
      clearTimeout(timerId);
    };
  }, [debouncedValue, callback, delay]);

  return setDebouncedValue;
};
export default useDebounce;
