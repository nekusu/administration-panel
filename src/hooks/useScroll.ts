import { useEffect, useRef, useState } from 'react';

export default function useScroll<T extends HTMLElement>() {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const targetRef = useRef<T>(null);
  const scrollTo = (options: ScrollToOptions) => targetRef.current?.scrollTo(options);

  useEffect(() => {
    const handleScroll = () => {
      if (targetRef.current) {
        setScroll({
          x: targetRef.current.scrollLeft,
          y: targetRef.current.scrollTop,
        });
      }
    };
    targetRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      targetRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scroll, scrollTo, targetRef };
}
