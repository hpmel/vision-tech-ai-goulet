import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';

const alphabet: string = 'VISIONTECHAI0101';
export const LetterRain = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const element: HTMLDivElement | null = ref.current;
    if (!element) return;
    const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      setVisible(entries[0]?.isIntersecting ?? false);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`letter-rain ${visible ? 'is-visible' : ''}`} aria-hidden="true">
    {Array.from({length:16}, (_: unknown, column: number) => <div className="rain-column" key={column} style={{'--delay':`${-column * 0.73}s`, '--duration':`${9 + column % 5}s`} as CSSProperties}>
      {Array.from({length:15}, (_value: unknown, row: number) => <span key={row}>{alphabet[(column * 7 + row * 3) % alphabet.length]}</span>)}
    </div>)}
  </div>;
};
