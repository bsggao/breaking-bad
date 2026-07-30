const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const seasons = [
  {
    label: "SEASON 01 · IGNITION",
    title: "点燃：绝境中的第一锅",
    text: "癌症诊断击碎日常，沃尔特找上昔日学生杰西，在新墨西哥荒漠的房车里完成第一次制毒。求生方案很快遭遇现实暴力，也让他第一次发现自己擅长掌控危险。",
    temperature: 24,
  },
  {
    label: "SEASON 02 · DIFFUSION",
    title: "扩散：蓝色产品进入城市",
    text: "图科让沃尔特和杰西看见地下市场的暴力规则；索尔与古斯则打开更庞大的产业入口。产品越走越远，谎言与代价也穿过家庭边界，形成一场看不见的连锁反应。",
    temperature: 43,
  },
  {
    label: "SEASON 03 · PRESSURE",
    title: "加压：精密系统里的不稳定变量",
    text: "超级实验室把个人手艺升级为工业生产，也让沃尔特进入古斯的控制体系。替代者、追查者与失控的合伙人同时靠近，密闭容器里的压力迅速越过安全值。",
    temperature: 65,
  },
  {
    label: "SEASON 04 · DETONATION",
    title: "爆炸：两位帝王只能留下一个",
    text: "古斯的秩序与沃尔特的自尊展开零和对抗。毒物、怀疑、复仇与亲情都成为棋子。沃尔特不再只是应对威胁，他开始主动设计一场足以重写地下版图的爆炸。",
    temperature: 88,
  },
  {
    label: "SEASON 05 · FALLOUT",
    title: "沉降：帝国在最高点解体",
    text: "扫清古斯之后，沃尔特建立真正属于自己的帝国。然而一本书把汉克带到答案面前，所有被压缩的因果同时释放。胜利、家庭与身份在荒漠中一起崩塌。",
    temperature: 100,
  },
];

const events = [
  {
    id: "diagnosis",
    caseNo: "INCIDENT 001",
    season: "SEASON 01 · EPISODE 01",
    code: "CATALYST",
    kicker: "THE CATALYST",
    title: "癌症诊断",
    text: "五十岁生日后的肺癌诊断，让沃尔特第一次以“时间不够”为理由重新计算人生。他决定用化学天赋留下钱，但这个看似明确的目标，很快与长期被压抑的自尊和野心结合。诊断触发了故事，却无法解释他后来每一次主动升级风险的选择。",
    impact: 82,
    tags: ["生存", "家庭", "自尊"],
  },
  {
    id: "first-cook",
    caseNo: "INCIDENT 002",
    season: "SEASON 01",
    code: "RV / 01",
    kicker: "THE FIRST REACTION",
    title: "荒漠第一锅",
    text: "沃尔特与昔日学生杰西在房车中完成第一次制毒。两人的能力互补：一个提供科学精度，一个了解地下市场；两人的性格却始终彼此冲突。这次合作创造了高纯度产品，也建立了一段由秘密、依赖和操控维系的关系。",
    impact: 88,
    tags: ["房车", "蓝色产品", "师徒"],
  },
  {
    id: "jane",
    caseNo: "INCIDENT 003",
    season: "SEASON 02",
    code: "ABQ / 737",
    kicker: "THE BUTTERFLY EFFECT",
    title: "蝴蝶效应",
    text: "沃尔特在关键时刻选择旁观简的死亡，以重新控制杰西。这个私密决定通过悲痛与失职继续扩散，最终在城市上空形成灾难。事件把全剧的因果观推到前台：没有一个选择真正只影响做出它的人。",
    impact: 91,
    tags: ["简", "旁观", "连锁后果"],
  },
  {
    id: "superlab",
    caseNo: "INCIDENT 004",
    season: "SEASON 03",
    code: "LAB / 03",
    kicker: "THE SEALED VESSEL",
    title: "超级实验室",
    text: "古斯用工业级实验室、稳定薪酬与专业尊重招募沃尔特。这看似是化学家的理想环境，实则是一套严密的控制系统。当沃尔特意识到自己可以被替换，专业合作迅速转为权力战争，实验室也从成就象征变成封闭牢笼。",
    impact: 76,
    tags: ["古斯", "工业化", "控制"],
  },
  {
    id: "gale",
    caseNo: "INCIDENT 005",
    season: "SEASON 03 · FINALE",
    code: "G.B. / 05",
    kicker: "THE POINT OF NO RETURN",
    title: "盖尔门前的枪声",
    text: "为了让古斯无法杀死沃尔特，杰西被迫面对盖尔并扣下扳机。这是师徒关系中最残酷的绑定：沃尔特用杰西的良知换取自己的生存。从此，杰西承担的不只是犯罪风险，更是无法轻易摆脱的精神创伤。",
    impact: 95,
    tags: ["盖尔", "杰西", "不可逆"],
  },
  {
    id: "faceoff",
    caseNo: "INCIDENT 006",
    season: "SEASON 04 · FINALE",
    code: "DING / 06",
    kicker: "THE DETONATION",
    title: "最后一次按铃",
    text: "沃尔特把赫克托对古斯的仇恨变成引线，在护理院完成致命布局。古斯建立多年的秩序被一次爆炸终结。沃尔特赢下战争，也跨过新的边界：他不再只是逃离死亡，而是在证明自己比对手更会设计死亡。",
    impact: 100,
    tags: ["古斯", "赫克托", "权力真空"],
  },
  {
    id: "hank",
    caseNo: "INCIDENT 007",
    season: "SEASON 05",
    code: "W.W. / 07",
    kicker: "THE DISCOVERY",
    title: "一本书的答案",
    text: "汉克在怀特家中偶然看到盖尔题赠给“W.W.”的书，零散线索突然组成完整图像。最危险的敌人一直是自己的家人。这个发现让追捕从职业任务变成私人背叛，也让沃尔特精心分隔的两个世界正面相撞。",
    impact: 97,
    tags: ["汉克", "W.W.", "身份暴露"],
  },
  {
    id: "felina",
    caseNo: "INCIDENT 008",
    season: "SEASON 05 · EPISODE 16",
    code: "FeLiNa",
    kicker: "THE FINAL EQUATION",
    title: "回到实验室",
    text: "流亡后的沃尔特回到阿尔伯克基，安排资金、承认真正动机，并完成最后一次清算。他救出杰西，也让自己的生命终止在最熟悉的实验设备旁。结局没有抹去伤害，只让他终于停止用家庭替自己的欲望命名。",
    impact: 100,
    tags: ["承认", "清算", "终局"],
  },
];

function initLoader() {
  const loader = qs("#loader");
  const hide = () => {
    window.setTimeout(() => loader?.classList.add("is-hidden"), 350);
  };

  if (document.readyState === "complete") hide();
  else window.addEventListener("load", hide, { once: true });
}

function initReveals() {
  const items = qsa(".reveal");

  items.forEach((item) => {
    const delay = item.dataset.delay;
    if (delay) item.style.setProperty("--delay", `${delay}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
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
}

function initNavigation() {
  const header = qs("#siteHeader");
  const navToggle = qs("#navToggle");
  const nav = qs("#mainNav");
  const navLinks = qsa('a[href^="#"]', nav);
  const sections = qsa("main section[id]");

  const closeNav = () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "打开导航");
  };

  navToggle?.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 30);

    const scrollPoint = window.scrollY + window.innerHeight * 0.35;
    let activeId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPoint) activeId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${activeId}`);
    });
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  qsa("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => {
      qs(button.dataset.scroll)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });
}

function initScrollProgress() {
  const progress = qs("#pageProgress");
  const storyRoad = qs(".story-road");
  const storyProgress = qs("#storyLineProgress");

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;

    if (storyRoad && storyProgress) {
      const rect = storyRoad.getBoundingClientRect();
      const start = window.innerHeight * 0.58;
      const travelled = start - rect.top;
      const height = rect.height;
      const storyRatio = Math.min(1, Math.max(0, travelled / height));
      storyProgress.style.height = `${storyRatio * 100}%`;
    }
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

function initHeroScene() {
  const heroScene = qs("#heroScene");
  if (!heroScene || prefersReducedMotion) return;

  const hero = qs(".hero");
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame;

  const animate = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    heroScene.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
    frame = requestAnimationFrame(animate);
  };

  hero?.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    targetY = -((event.clientY - rect.top) / rect.height - 0.5) * 8;
  });

  hero?.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
  });

  frame = requestAnimationFrame(animate);
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
}

function initCanvas() {
  const canvas = qs("#chemCanvas");
  const hero = qs(".hero");
  if (!canvas || !hero || prefersReducedMotion) return;

  const context = canvas.getContext("2d");
  const nodes = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let pointer = { x: -1000, y: -1000 };
  let frame;

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(22, Math.min(54, Math.floor(width / 28)));
    nodes.length = 0;
    for (let i = 0; i < count; i += 1) {
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

      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distance = Math.hypot(dx, dy);
        if (distance >= 105) continue;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(151, 210, 143, ${(1 - distance / 105) * 0.22})`;
        context.lineWidth = 0.6;
        context.stroke();
      }
    });

    frame = requestAnimationFrame(draw);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  });
  hero.addEventListener("pointerleave", () => {
    pointer = { x: -1000, y: -1000 };
  });

  window.addEventListener("resize", resize);
  resize();
  draw();
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame), { once: true });
}

function initTiltCards() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  qsa("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 7;
      const rotateX = (0.5 - y) * 7;
      card.style.setProperty("--rotate-x", `${rotateX}deg`);
      card.style.setProperty("--rotate-y", `${rotateY}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
    });
  });
}

function initCharacterCards() {
  qsa(".character-card").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(flipped));
    });
  });
}

function initSeasonLab() {
  const tabs = qsa(".season-tab");
  const stage = qs("#seasonStage");
  const copy = qs(".season-stage__copy");
  const title = qs("#seasonStageTitle");
  const text = qs("#seasonStageText");
  const label = qs(".season-stage__label");
  const tempBar = qs("#temperatureBar");
  const tempValue = qs("#temperatureValue");

  const selectSeason = (index, scroll = false) => {
    const season = seasons[index];
    if (!season || !stage) return;

    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    stage.style.setProperty("--active-season", index);
    copy?.classList.remove("is-changing");
    void copy?.offsetWidth;
    copy?.classList.add("is-changing");

    if (label) label.textContent = season.label;
    if (title) title.textContent = season.title;
    if (text) text.textContent = season.text;
    if (tempBar) tempBar.style.width = `${season.temperature}%`;
    if (tempValue) tempValue.textContent = `${season.temperature}%`;

    if (scroll) {
      stage.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectSeason(index));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + tabs.length) % tabs.length;
      tabs[next].focus();
      selectSeason(next);
    });
  });

  qsa("[data-season-link]").forEach((beat) => {
    beat.addEventListener("dblclick", () => selectSeason(Number(beat.dataset.seasonLink), true));
  });
}

function initEventDialog() {
  const dialog = qs("#eventDialog");
  if (!dialog) return;

  const title = qs("#dialogTitle");
  const text = qs("#dialogText");
  const caseNo = qs("#dialogCase");
  const season = qs("#dialogSeason");
  const code = qs("#dialogCode");
  const kicker = qs("#dialogKicker");
  const impact = qs("#dialogImpact");
  const impactValue = qs("#dialogImpactValue");
  const tags = qs("#dialogTags");
  const prev = qs("#dialogPrev");
  const next = qs("#dialogNext");
  let currentIndex = 0;
  let lastTrigger = null;

  const render = (index) => {
    currentIndex = (index + events.length) % events.length;
    const event = events[currentIndex];

    if (caseNo) caseNo.textContent = event.caseNo;
    if (season) season.textContent = event.season;
    if (code) code.textContent = event.code;
    if (kicker) kicker.textContent = event.kicker;
    if (title) title.textContent = event.title;
    if (text) text.textContent = event.text;
    if (impactValue) impactValue.textContent = `${event.impact}%`;
    if (tags) {
      tags.replaceChildren(
        ...event.tags.map((tag) => {
          const span = document.createElement("span");
          span.textContent = tag;
          return span;
        }),
      );
    }

    if (impact) {
      impact.style.width = "0";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          impact.style.width = `${event.impact}%`;
        });
      });
    }
  };

  const open = (eventId, trigger) => {
    const index = events.findIndex((event) => event.id === eventId);
    if (index < 0) return;
    lastTrigger = trigger;
    render(index);
    document.body.classList.add("dialog-open");
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const close = () => {
    document.body.classList.remove("dialog-open");
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    lastTrigger?.focus();
  };

  qsa(".event-card").forEach((card) => {
    card.addEventListener("click", () => open(card.dataset.event, card));
  });
  qsa("[data-dialog-close]", dialog).forEach((button) => button.addEventListener("click", close));
  prev?.addEventListener("click", () => render(currentIndex - 1));
  next?.addEventListener("click", () => render(currentIndex + 1));

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
}

function initMagneticButtons() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  qsa(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.06}px, ${y * 0.1}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });
}

function init() {
  initLoader();
  initReveals();
  initNavigation();
  initScrollProgress();
  initHeroScene();
  initCanvas();
  initTiltCards();
  initCharacterCards();
  initSeasonLab();
  initEventDialog();
  initMagneticButtons();
}

init();
