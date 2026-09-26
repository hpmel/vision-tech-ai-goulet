import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Language } from '../content';

gsap.registerPlugin(ScrollTrigger);

export const usePageMotion = (root: RefObject<HTMLDivElement | null>, motion: boolean, lang: Language): void => {
  useEffect(() => {
    const element: HTMLDivElement | null = root.current;
    if (!element || !motion) return;
    const context: gsap.Context = gsap.context((self: gsap.Context) => {
      const match: gsap.MatchMedia = gsap.matchMedia();
      match.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((target: HTMLElement) => {
          gsap.fromTo(target, {yPercent:-7}, {yPercent:7,ease:'none',scrollTrigger:{trigger:target.parentElement,start:'top bottom',end:'bottom top',scrub:1.2}});
        });
        gsap.fromTo('.process-art .vision-sculpture', {rotate:-5,scale:.92}, {rotate:5,scale:1.09,ease:'none',scrollTrigger:{trigger:'.process-layout',start:'top 70%',end:'bottom 65%',scrub:1.1}});
      });

      const manifesto: HTMLElement | null = element.querySelector('.manifesto');
      if (manifesto) {
        gsap.fromTo('.manifesto-word', {color:'#77747a'}, {color:'#f4f1ee',stagger:.12,ease:'none',scrollTrigger:{trigger:manifesto,start:'top 75%',end:'center 42%',scrub:.7}});
      }
      const image: HTMLElement | null = element.querySelector('.human-image');
      if (image) {
        ScrollTrigger.create({trigger:image,start:'top 80%',once:true,onEnter:() => {
          self.add(() => {
            gsap.fromTo('.cinematic-shutters span',{scaleY:1},{scaleY:0,stagger:.12,duration:1.15,ease:'power4.inOut'});
            gsap.fromTo('.human-image img',{scale:1.18},{scale:1,duration:1.8,ease:'power3.out'});
          });
        }});
      }
      gsap.utils.toArray<HTMLElement>('.pain-card, .process article, .service').forEach((target: HTMLElement, index: number) => {
        ScrollTrigger.create({trigger:target,start:'top 92%',once:true,onEnter:() => {
          self.add(() => {
            gsap.fromTo(target,{y:30,opacity:.35},{y:0,opacity:1,duration:.85,delay:Math.min(index % 3 * .06,.12),ease:'power3.out',clearProps:'transform,opacity'});
          });
        }});
      });
      gsap.fromTo('.process-progress', {scaleY:0}, {scaleY:1,ease:'none',scrollTrigger:{trigger:'.process',start:'top 65%',end:'bottom 70%',scrub:.8}});
    }, element);
    const refresh = (): void => ScrollTrigger.refresh();
    window.addEventListener('load',refresh);
    return () => {window.removeEventListener('load',refresh);context.revert();};
  }, [root,motion,lang]);
};
