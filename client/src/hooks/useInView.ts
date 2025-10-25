import { useEffect, useRef } from "react";

export default function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.classList.add("observe-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) node.classList.add("in-view");
          else node.classList.remove("in-view");
        });
      },
      options ?? { threshold: 0.15 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return ref;
}