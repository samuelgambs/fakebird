import { useRef, useEffect, useCallback } from "react";

const useMounted = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const isMounted = useCallback(() => {
    return mountedRef.current;
  }, [mountedRef]);

  return isMounted;
};

export default useMounted;
