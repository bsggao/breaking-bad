import { useEffect } from "react";

const selectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setupRevealAnimations(prefersReducedMotion) {
  const items = selectAll(".reveal:not(.character-card)");
  items.forEach((item) => {
    if (item.dataset.delay) item.style.setProperty("--delay", `${item.dataset.delay}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );

  items.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}

function setupScrollProgress() {
  const progress = document.querySelector("#pageProgress");
  const storyRoad = document.querySelector(".story-road");
  const storyProgress = document.querySelector("#storyLineProgress");

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;

    if (storyRoad && storyProgress) {
      const rect = storyRoad.getBoundingClientRect();
      const travelled = window.innerHeight * 0.58 - rect.top;
      const storyRatio = Math.min(1, Math.max(0, travelled / rect.height));
      storyProgress.style.height = `${storyRatio * 100}%`;
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  return () => {
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", update);
  };
}

function setupHeroScene(prefersReducedMotion) {
  const heroScene = document.querySelector("#heroScene");
  const hero = document.querySelector(".hero");
  if (!heroScene || !hero || prefersReducedMotion) return () => {};

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;

  const animate = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    heroScene.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
    frame = window.requestAnimationFrame(animate);
  };

  const handleMove = (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 8;
  };

  const handleLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  hero.addEventListener("pointermove", handleMove);
  hero.addEventListener("pointerleave", handleLeave);
  frame = window.requestAnimationFrame(animate);

  return () => {
    hero.removeEventListener("pointermove", handleMove);
    hero.removeEventListener("pointerleave", handleLeave);
    window.cancelAnimationFrame(frame);
  };
}

function setupCanvas(prefersReducedMotion) {
  const canvas = document.querySelector("#chemCanvas");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero || prefersReducedMotion) return () => {};

  const context = canvas.getContext("2d");
  const nodes = [];
  let width = 0;
  let height = 0;
  let pointer = { x: -1000, y: -1000 };
  let frame = 0;

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(22, Math.min(54, Math.floor(width / 28)));
    nodes.length = 0;
    for (let index = 0; index < count; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.7 + 0.8,
        acid: Math.random() > 0.72,
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    nodes.forEach((node, index) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < -10) node.x = width + 10;
      if (node.x > width + 10) node.x = -10;
      if (node.y < -10) node.y = height + 10;
      if (node.y > height + 10) node.y = -10;

      const dxPointer = node.x - pointer.x;
      const dyPointer = node.y - pointer.y;
      const pointerDistance = Math.hypot(dxPointer, dyPointer);
      if (pointerDistance < 130 && pointerDistance > 0) {
        node.x += (dxPointer / pointerDistance) * 0.45;
        node.y += (dyPointer / pointerDistance) * 0.45;
      }

      context.beginPath();
      context.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      context.fillStyle = node.acid ? "rgba(184, 223, 62, .72)" : "rgba(104, 223, 233, .48)";
      context.shadowBlur = 10;
      context.shadowColor = node.acid ? "#b8df3e" : "#68dfe9";
      context.fill();
      context.shadowBlur = 0;

      for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
        const other = nodes[otherIndex];
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance >= 105) continue;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(151, 210, 143, ${(1 - distance / 105) * 0.22})`;
        context.lineWidth = 0.6;
        context.stroke();
      }
    });

    frame = window.requestAnimationFrame(draw);
  };

  const handleMove = (event) => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const handleLeave = () => {
    pointer = { x: -1000, y: -1000 };
  };

  hero.addEventListener("pointermove", handleMove);
  hero.addEventListener("pointerleave", handleLeave);
  window.addEventListener("resize", resize);
  resize();
  draw();

  return () => {
    hero.removeEventListener("pointermove", handleMove);
    hero.removeEventListener("pointerleave", handleLeave);
    window.removeEventListener("resize", resize);
    window.cancelAnimationFrame(frame);
  };
}

function setupTiltCards(prefersReducedMotion) {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return () => {};

  const cleanups = selectAll("[data-tilt]").map((card) => {
    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--rotate-x", `${(0.5 - y) * 7}deg`);
      card.style.setProperty("--rotate-y", `${(x - 0.5) * 7}deg`);
    };
    const handleLeave = () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
    };

    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", handleLeave);
    return () => {
      card.removeEventListener("pointermove", handleMove);
      card.removeEventListener("pointerleave", handleLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function setupMagneticButtons(prefersReducedMotion) {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return () => {};

  const cleanups = selectAll(".magnetic").map((button) => {
    const handleMove = (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.06}px, ${y * 0.1}px)`;
    };
    const handleLeave = () => {
      button.style.transform = "translate(0, 0)";
    };

    button.addEventListener("pointermove", handleMove);
    button.addEventListener("pointerleave", handleLeave);
    return () => {
      button.removeEventListener("pointermove", handleMove);
      button.removeEventListener("pointerleave", handleLeave);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

function setupScrollButtons(prefersReducedMotion) {
  const cleanups = selectAll("[data-scroll]").map((button) => {
    const handleClick = () => {
      document.querySelector(button.dataset.scroll)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };
    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

export default function usePageEffects() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loader = document.querySelector("#loader");
    const loaderTimer = window.setTimeout(() => loader?.classList.add("is-hidden"), 350);
    const cleanups = [
      setupRevealAnimations(prefersReducedMotion),
      setupScrollProgress(),
      setupHeroScene(prefersReducedMotion),
      setupCanvas(prefersReducedMotion),
      setupTiltCards(prefersReducedMotion),
      setupMagneticButtons(prefersReducedMotion),
      setupScrollButtons(prefersReducedMotion),
    ];

    return () => {
      window.clearTimeout(loaderTimer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
}
