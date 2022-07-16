import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useWindowScrollPosition(
  localStorageKey: string,
  setCondition: boolean
): void {
  const [scrollYStorage, setScrollYStorage] = useLocalStorage(
    localStorageKey,
    0
  );
  useEffect(() => {
    if (setCondition) {
      console.log("here completed loading");
      window.scrollTo(0, scrollYStorage);
    }
  }, [setCondition, scrollYStorage]);

  useEffect(() => {
    return () => {
      setScrollYStorage(window.scrollY);
    };
  }, []);
}
