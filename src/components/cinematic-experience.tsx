"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CinematicCanvas = dynamic(() => import("./cinematic-canvas"), {
  ssr: false,
  loading: () => (
    <div className="canvas-loading" aria-live="polite">
      <span />
      <p>3D орчныг бэлтгэж байна</p>
    </div>
  ),
});

const beats = [
  { number: "01", label: "Нээлт" },
  { number: "02", label: "Алтан Од" },
  { number: "03", label: "Деталь" },
  { number: "04", label: "Найрлага" },
  { number: "05", label: "Замнал" },
  { number: "06", label: "Нийлүүлэлт" },
  { number: "07", label: "Компани" },
  { number: "08", label: "Холбоо" },
];

export function CinematicExperience() {
  const filmRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = filmRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
        },
      });

      gsap.utils.toArray<HTMLElement>(".story-copy").forEach((copy, index) => {
        const section = copy.closest(".story-section");
        if (!section || index === 0) return;
        gsap.fromTo(
          copy,
          { autoAlpha: 0, y: 42 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 62%",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
        gsap.to(copy, {
          autoAlpha: 0,
          y: -34,
          ease: "power2.in",
          scrollTrigger: {
            trigger: section,
            start: "bottom 48%",
            end: "bottom 18%",
            scrub: 1,
          },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main id="film" ref={filmRef} className="film-shell">
      <a className="skip-link" href="#contact">Холбоо барих хэсэг рүү очих</a>

      <div className="cinematic-stage" aria-hidden="true">
        <div className="depth-title depth-title--back">GOLDEN STAR</div>
        <CinematicCanvas />
        <div className="film-grain" />
        <div className="frame-corners" />
      </div>

      <header className="site-header">
        <a className="brand-mark" href="#opening" aria-label="Алтан Заан Анар - эхлэл">
          <span className="brand-symbol">АЗА</span>
          <span className="brand-name">АЛТАН ЗААН АНАР</span>
        </a>
        <a className="header-contact" href="#contact">ХОЛБОО БАРИХ <span>↗</span></a>
      </header>

      <aside className="chapter-rail" aria-label="Танилцуулгын бүлгүүд">
        {beats.map((beat) => (
          <span key={beat.number}>
            <b>{beat.number}</b>
            <em>{beat.label}</em>
          </span>
        ))}
      </aside>

      <div className="scroll-progress" aria-hidden="true"><div ref={progressRef} /></div>

      <section id="opening" className="story-section story-section--opening" data-scene="opening">
        <div className="story-copy hero-copy">
          <p className="eyebrow">VIETNAM · MONGOLIA</p>
          <h1><span>АЛТАН</span><span className="outlined">ОД</span></h1>
          <div className="hero-meta">
            <p>Вьетнамын танил үнэр. Монголд хүрэх шинэ орон зай.</p>
            <span>SCROLL TO ENTER</span>
          </div>
        </div>
      </section>

      <section className="story-section story-section--product" data-scene="product">
        <div className="story-copy copy-right">
          <p className="eyebrow">THE ICONIC RED TIN</p>
          <h2>НЭГ ДҮР.<br />НЭГ ТАНИЛ<br />МЭДРЭМЖ.</h2>
          <p className="support-copy">Улаан металл сав, ногоон од, үе дамжсан танил төрх.</p>
        </div>
      </section>

      <section className="story-section story-section--macro" data-scene="macro">
        <div className="story-copy macro-copy">
          <p className="eyebrow">MACRO / 1970 → TODAY</p>
          <h2>ДЕТАЛЬ<br />БҮРТ ТҮҮХ<br />ХАДГАЛАГДАНА.</h2>
          <span className="technical-note">01 — LABEL / 02 — TIN / 03 — AROMA</span>
        </div>
      </section>

      <section className="story-section story-section--ingredients" data-scene="ingredients">
        <div className="story-copy ingredient-copy">
          <p className="eyebrow">AROMATIC COMPOSITION</p>
          <h2>ЗУРГААН<br />ҮНЭРТ<br />ДАВХАРГА.</h2>
          <div className="ingredient-orbit" aria-label="Бүтээгдэхүүний найрлага">
            <span>MENTHOL</span><span>CAMPHOR</span><span>PEPPERMINT</span>
            <span>EUCALYPTUS</span><span>BASIL</span><span>CINNAMON</span>
          </div>
        </div>
      </section>

      <section className="story-section story-section--route" data-scene="route">
        <div className="story-copy route-copy">
          <div className="route-point route-point--start"><small>21°01′N</small><strong>VIETNAM</strong></div>
          <div className="route-statement">
            <p className="eyebrow">A CONTINUOUS JOURNEY</p>
            <h2>ӨМНӨДИЙН<br />ҮНЭРЭЭС<br />ТАЛЫН ОРОНД.</h2>
          </div>
          <div className="route-point route-point--end"><small>47°55′N</small><strong>MONGOLIA</strong></div>
        </div>
      </section>

      <section className="story-section story-section--supply" data-scene="supply">
        <div className="story-copy supply-copy">
          <p className="eyebrow">SUPPLY IN MOTION</p>
          <h2>НЭГЭЭС<br />ОЛОН РУУ.</h2>
          <p className="support-copy">Тогтвортой нийлүүлэлт. Нэг танил бүтээгдэхүүн. Илүү өргөн хүрээ.</p>
        </div>
      </section>

      <section className="story-section story-section--company" data-scene="company">
        <div className="story-copy company-copy">
          <p className="eyebrow">DISTRIBUTED IN MONGOLIA</p>
          <h2>АЛТАН<br />ЗААН<br />АНАР</h2>
          <div className="company-line"><span>ЭМ ХАНГАН НИЙЛҮҮЛЭЛТ</span><span>УЛААНБААТАР</span></div>
        </div>
      </section>

      <section id="contact" className="story-section story-section--final" data-scene="final">
        <div className="story-copy final-copy">
          <p className="eyebrow">LET’S CONNECT</p>
          <h2>ХАМТЫН<br />АЖИЛЛАГАА<br />ЭНДЭЭС.</h2>
          <div className="contact-links">
            <a href="tel:+97677115129">7711-5129 <span>↗</span></a>
            <a href="tel:+97688085129">8808-5129 <span>↗</span></a>
          </div>
          <p className="address">Баянгол дүүрэг, 19-р хороо, 65А байр · Улаанбаатар</p>
        </div>
        <footer className="film-footer"><span>АЛТАН ЗААН АНАР ХХК</span><span>ТАНИЛЦУУЛГА · 2026</span></footer>
      </section>
    </main>
  );
}
