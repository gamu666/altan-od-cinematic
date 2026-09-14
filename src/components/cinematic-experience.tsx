"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
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
  { number: "05", label: "Хэрэглээ" },
  { number: "06", label: "Замнал" },
  { number: "07", label: "Нийлүүлэлт" },
  { number: "08", label: "Компани" },
  { number: "09", label: "Холбоо" },
];

export function CinematicExperience() {
  const filmRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = filmRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap.timeline()
        .fromTo(".hero-copy .eyebrow", {
          autoAlpha: 0,
          y: 8,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
        })
        .fromTo(".hero-title span", {
          autoAlpha: 0,
          x: -24,
          clipPath: "inset(0 100% 0 0)",
        }, {
          autoAlpha: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.62,
          stagger: 0.08,
          ease: "power4.out",
        }, "-=0.1")
        .fromTo(".hero-meta", {
          autoAlpha: 0,
          y: 10,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power3.out",
        }, "-=0.28");

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

      const routeSection = root.querySelector(".story-section--route");
      const routeLine = root.querySelector(".route-track span");
      const routeDot = root.querySelector(".route-track i");
      if (routeSection && routeLine && routeDot) {
        gsap.fromTo(routeLine, { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: routeSection,
            start: "top 45%",
            end: "top 5%",
            scrub: 0.8,
          },
        });
        gsap.fromTo(routeDot, { left: "0%" }, {
          left: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: routeSection,
            start: "top 45%",
            end: "top 5%",
            scrub: 0.8,
          },
        });
      }

      const sections = gsap.utils.toArray<HTMLElement>(".story-section");
      const copies = gsap.utils.toArray<HTMLElement>(".story-copy");
      const chapterRows = gsap.utils.toArray<HTMLElement>(".chapter-rail span");
      const activateChapter = (activeIndex: number) => {
        chapterRows.forEach((row, rowIndex) => {
          row.classList.toggle("is-active", rowIndex === activeIndex);
          if (rowIndex === activeIndex) row.setAttribute("aria-current", "step");
          else row.removeAttribute("aria-current");
        });
      };

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) activateChapter(index);
          },
          onRefresh: (self) => {
            if (self.isActive) activateChapter(index);
          },
        });
      });

      copies.forEach((copy, index) => {
        const section = copy.closest<HTMLElement>(".story-section");
        if (!section) return;
        const entranceX = copy.classList.contains("copy-right")
          ? 48
          : copy.classList.contains("copy-left")
            ? -48
            : 0;

        if (index === 0) {
          const nextSection = sections[1];
          if (nextSection) {
            gsap.to(copy, {
              autoAlpha: 0,
              x: -30,
              ease: "power2.in",
              scrollTrigger: {
                trigger: nextSection,
                start: "top 92%",
                end: "top 70%",
                scrub: 0.45,
              },
            });
          }
          return;
        }

        gsap.set(copy, { autoAlpha: 0, x: entranceX });
        gsap.fromTo(
          copy,
          { autoAlpha: 0, x: entranceX },
          {
            autoAlpha: 1,
            x: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 62%",
              end: "top 34%",
              scrub: 0.5,
            },
          },
        );

        const sectionIndex = sections.indexOf(section);
        const nextSection = sections[sectionIndex + 1];
        if (nextSection) {
          gsap.to(copy, {
            autoAlpha: 0,
            x: entranceX * -0.45,
            ease: "power2.in",
            scrollTrigger: {
              trigger: nextSection,
              start: "top 88%",
              end: "top 66%",
              scrub: 0.45,
            },
          });
        }
      });
    }, root);

    return () => {
      context.revert();
    };
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
          <svg
            className="brand-symbol"
            viewBox="0 0 520 680"
            role="img"
            aria-label="Алтан Заан Анар лого"
          >
            <path d="M20 306V132C20 61 77 20 150 20H168V430M20 265H168" />
            <path d="M205 20H302V658H202M205 306H302" />
            <path d="M342 430V20H360C433 20 500 61 500 132V306M342 265H500" />
          </svg>
          <span className="brand-name">АЛТАН ЗААН АНАР</span>
        </a>
        <a className="header-contact" href="#contact">ХОЛБОО БАРИХ <span>↗</span></a>
      </header>

      <aside className="chapter-rail" aria-label="Танилцуулгын бүлгүүд">
        {beats.map((beat) => (
          <span key={beat.number} className={beat.number === "01" ? "is-active" : undefined}>
            <b>{beat.number}</b>
            <em>{beat.label}</em>
          </span>
        ))}
      </aside>

      <div className="scroll-progress" aria-hidden="true"><div ref={progressRef} /></div>

      <section id="opening" className="story-section story-section--opening" data-scene="opening">
        <div className="story-copy copy-left hero-copy">
          <p className="eyebrow">VIETNAM · MONGOLIA</p>
          <h1 className="hero-title"><span>АЛТАН</span><span>ОД</span></h1>
          <div className="hero-meta">
            <p>Вьетнамын үнэрт уламжлалыг Монголын өдөр тутамд ойртуулна.</p>
            <span>SCROLL TO ENTER</span>
          </div>
        </div>
      </section>

      <section className="story-section story-section--product" data-scene="product">
        <div className="story-copy copy-left">
          <p className="eyebrow">THE ICONIC RED TIN</p>
          <h2>ТАНИЛ ТӨРХ.<br />ТҮҮХТ<br />ҮНЭР.</h2>
          <p className="support-copy">1970 оноос өнөөдрийг хүртэл танил улаан металл сав, ногоон дэвсгэр дээрх алтан од.</p>
          <dl className="product-facts" aria-label="Бүтээгдэхүүний үндсэн мэдээлэл">
            <div><dt>ГАРАЛ</dt><dd>ВЬЕТНАМ</dd></div>
            <div><dt>ТӨРӨЛ</dt><dd>ҮНЭРТ ГАВАР</dd></div>
            <div><dt>ҮЙЛДВЭРЛЭЛ</dt><dd>1970 → ӨНӨӨДӨР</dd></div>
          </dl>
        </div>
      </section>

      <section id="macro" className="story-section story-section--macro" data-scene="macro">
        <div className="story-copy copy-right macro-copy">
          <p className="eyebrow">MACRO / 1970 → TODAY</p>
          <h2><span>ДЕТАЛЬ</span><span>БҮРТ ТҮҮХ</span><span>ХАДГАЛАГДАНА.</span></h2>
          <span className="technical-note">01 — LABEL / 02 — TIN / 03 — AROMA</span>
        </div>
      </section>

      <section id="ingredients" className="story-section story-section--ingredients" data-scene="ingredients">
        <div className="story-copy copy-left ingredient-copy">
          <p className="eyebrow">AROMATIC COMPOSITION · 100 ГР ТОСОНД</p>
          <h2>ЗУРГААН<br />НАЙРЛАГА.<br />НЭГ ТАНИЛ<br />ҮНЭР.</h2>
          <ol className="ingredient-ledger" aria-label="Бүтээгдэхүүний найрлага">
            <li><span><b>01</b>MENTHOL</span><strong>1.12 Г</strong></li>
            <li><span><b>02</b>CAMPHOR</span><strong>19.47 Г</strong></li>
            <li><span><b>03</b>PEPPERMINT OIL</span><strong>5.94 Г</strong></li>
            <li><span><b>04</b>EUCALYPTUS OIL</span><strong>21.45 Г</strong></li>
            <li><span><b>05</b>BASIL OIL</span><strong>1.88 Г</strong></li>
            <li><span><b>06</b>CINNAMON OIL</span><strong>1.88 Г</strong></li>
          </ol>
        </div>
      </section>

      <section id="usage" className="story-section story-section--usage" data-scene="usage">
        <div className="story-copy copy-right usage-copy">
          <p className="eyebrow">BROCHURE USE GUIDE</p>
          <h2>ӨДӨР ТУТМЫН<br />ОЛОН ХЭРЭГЛЭЭ.</h2>
          <div className="usage-list" aria-label="Brochure-д заасан хэрэглээ">
            <p><b>01</b><span>Ханиад, томуу, хамар битүүрэх үед</span></p>
            <p><b>02</b><span>Толгой өвдөх, дотор муухайрах үед</span></p>
            <p><b>03</b><span>Булчин, нуруу, үе мөч чилэх үед</span></p>
            <p><b>04</b><span>Шавж, шумуулд хазуулсан үед</span></p>
          </div>
          <p className="safety-note">Ил шарх, нүд, салст бүрхэвчид түрхэхгүй. Найрлагад харшилтай бол хэрэглэхгүй.</p>
        </div>
      </section>

      <section id="route" className="story-section story-section--route" data-scene="route">
        <div className="story-copy route-copy">
          <div className="route-track" aria-hidden="true"><span /><i /></div>
          <div className="route-point route-point--start"><small>21°01′N</small><strong>VIETNAM</strong></div>
          <div className="route-statement">
            <p className="eyebrow">ONE CONTINUOUS JOURNEY</p>
            <h2>ВЬЕТНАМААС<br />МОНГОЛ<br />РУУ.</h2>
          </div>
          <div className="route-point route-point--end"><small>47°55′N</small><strong>MONGOLIA</strong></div>
        </div>
      </section>

      <section id="supply" className="story-section story-section--supply" data-scene="supply">
        <div className="story-copy copy-left supply-copy">
          <p className="eyebrow">SUPPLY IN MOTION</p>
          <h2>НЭГ САВНААС<br />ӨРГӨН ХҮРЭЭ<br />РҮҮ.</h2>
          <p className="support-copy">Тогтвортой татан авалт. Найдвартай түгээлт. Илүү өргөн хүртээмж.</p>
        </div>
      </section>

      <section className="story-section story-section--company" data-scene="company">
        <div className="story-copy copy-left company-copy">
          <p className="eyebrow">DISTRIBUTED IN MONGOLIA</p>
          <h2>АЛТАН<br />ЗААН<br />АНАР</h2>
          <div className="company-line"><span>ЭМ ХАНГАН НИЙЛҮҮЛЭЛТ</span><span>УЛААНБААТАР</span></div>
        </div>
      </section>

      <section id="contact" className="story-section story-section--final" data-scene="final">
        <div className="story-copy copy-left final-copy">
          <p className="eyebrow">LET’S CONNECT</p>
          <h2>ХАМТЫН ӨСӨЛТ<br />ЭНДЭЭС<br />ЭХЭЛНЭ.</h2>
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
