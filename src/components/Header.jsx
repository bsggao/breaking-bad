import { useEffect, useState } from "react";

const navItems = [
  ["premise", "反应起点"],
  ["characters", "人物档案"],
  ["timeline", "剧情流程"],
  ["events", "关键事件"],
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const update = () => {
      setIsScrolled(window.scrollY > 30);

      const scrollPoint = window.scrollY + window.innerHeight * 0.35;
      let nextActive = "";
      document.querySelectorAll("main section[id]").forEach((section) => {
        if (section.offsetTop <= scrollPoint) nextActive = section.id;
      });
      setActiveSection(nextActive);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("keydown", closeOnEscape);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`} id="siteHeader">
      <a className="brand" href="#top" aria-label="Breaking Bad 剧情档案首页">
        <span className="brand__tile"><small>35</small><b>Br</b></span>
        <span className="brand__word">eaking</span>
        <span className="brand__tile"><small>56</small><b>Ba</b></span>
        <span className="brand__word">d</span>
      </a>

      <button
        className="nav-toggle"
        type="button"
        aria-label={isOpen ? "关闭导航" : "打开导航"}
        aria-controls="mainNav"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span></span><span></span>
      </button>

      <nav className={`main-nav${isOpen ? " is-open" : ""}`} id="mainNav" aria-label="主导航">
        {navItems.map(([id, label]) => (
          <a
            className={activeSection === id ? "is-active" : undefined}
            href={`#${id}`}
            key={id}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="spoiler-chip"><i></i> 全剧剧透</div>
    </header>
  );
}
