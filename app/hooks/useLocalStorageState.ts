import * as React from "react";

export default function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
  // the = {} fixes the error we would get from destructuring when no argument was passed
  // Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(() => {
    try {
      console.log(window);
    } catch (error) {
      return undefined;
    }
    if (window !== undefined) {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        // the try/catch is here in case the localStorage value was set before
        // we had the serialization in place (like we do in previous extra credits)
        try {
          return deserialize(valueInLocalStorage);
        } catch (error) {
          window.localStorage.removeItem(key);
        }
      }
    }

    // @ts-ignore
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const prevKeyRef = React.useRef(key);

  // Check the example at src/examples/local-state-key-change.js to visualize a key change
  React.useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}
