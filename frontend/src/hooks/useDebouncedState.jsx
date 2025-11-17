import { useState, useEffect } from "react";

function useDebouncedState(initialValue = "", delay = 1000) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return [debouncedValue, value, setValue];
}

export default useDebouncedState;
