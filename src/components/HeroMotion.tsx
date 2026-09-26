import { useEffect, useRef, type ReactElement } from 'react';
import { siteConfig } from '../site.config';

export const HeroMotion = ({ motion }: { motion: boolean }): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video: HTMLVideoElement | null = videoRef.current;
    if (!video) return;
    let visible: boolean = true;
    let disposed: boolean = false;
    const update = async (): Promise<void> => {
      if (!motion || !visible || document.hidden || disposed) {
        video.pause();
        return;
      }
      try {
        await video.play();
        if (disposed || !visible || document.hidden) video.pause();
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.warn('La lecture automatique du décor vidéo est indisponible.', error);
      }
    };
    const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      visible = entries[0]?.isIntersecting ?? false;
      void update();
    });
    observer.observe(video);
    document.addEventListener('visibilitychange', update);
    video.addEventListener('canplay', update);
    void update();
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      video.removeEventListener('canplay', update);
      video.pause();
    };
  }, [motion]);

  return <div className="hero-art hero-data-motion" aria-hidden="true">
    <video ref={videoRef} muted loop playsInline preload="auto" poster={siteConfig.assets.heroPoster} tabIndex={-1}>
      <source src={siteConfig.assets.heroVideo} type="video/mp4" />
    </video>
  </div>;
};
