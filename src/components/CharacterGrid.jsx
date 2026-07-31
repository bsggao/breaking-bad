import { useEffect, useRef, useState } from "react";
import { characters } from "../data";

function CharacterCard({ character }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      className={`character-card reveal${isVisible ? " is-visible" : ""}${isFlipped ? " is-flipped" : ""}`}
      type="button"
      aria-label={`${character.name}人物档案，点击${isFlipped ? "返回正面" : "查看背面"}`}
      aria-pressed={isFlipped}
      data-character={character.id}
      data-delay={character.delay || undefined}
      ref={cardRef}
      style={character.delay ? { "--delay": `${character.delay}ms` } : undefined}
      onClick={() => setIsFlipped((flipped) => !flipped)}
    >
      <span className="character-card__inner">
        <span className="character-card__face character-card__front">
          <span className="character-card__number">{character.number}</span>
          <span className={`character-portrait character-portrait--${character.id}`}>
            <img
              className="character-portrait__backdrop"
              src={character.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
            <img
              className="character-portrait__subject"
              src={character.image}
              alt={character.imageAlt}
              loading="lazy"
              decoding="async"
            />
            <span className="character-portrait__molecule" aria-hidden="true">
              <span className="molecule-3d__frame">
                <span className="molecule-3d__bond molecule-3d__bond--1"></span>
                <span className="molecule-3d__bond molecule-3d__bond--2"></span>
                <span className="molecule-3d__bond molecule-3d__bond--3"></span>
                <span className="molecule-3d__bond molecule-3d__bond--4"></span>
                <span className="molecule-3d__bond molecule-3d__bond--5"></span>
                <i className="molecule-3d__node molecule-3d__node--1"></i>
                <i className="molecule-3d__node molecule-3d__node--2"></i>
                <i className="molecule-3d__node molecule-3d__node--3"></i>
                <i className="molecule-3d__node molecule-3d__node--4"></i>
                <b className="molecule-3d__core"></b>
              </span>
            </span>
            <em>{character.initials}</em>
          </span>
          <span className="character-card__role">{character.role}</span>
          <strong>{character.name}</strong>
          <small>{character.englishName}</small>
          <span className="character-card__hint">点击翻转 <i>↗</i></span>
        </span>
        <span className="character-card__face character-card__back">
          <span className="character-card__symbol">{character.symbol}</span>
          <span className="character-card__back-index">{character.number} / 06</span>
          <strong>{character.headline}</strong>
          <p>{character.description}</p>
          <span className="character-card__arc">
            <i style={{ "--level": character.level }}></i>
          </span>
          <span className="character-card__trait">{character.traits}</span>
        </span>
      </span>
    </button>
  );
}

export default function CharacterGrid() {
  return (
    <div className="character-grid">
      {characters.map((character) => (
        <CharacterCard character={character} key={character.id} />
      ))}
    </div>
  );
}
