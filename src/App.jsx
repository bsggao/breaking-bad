import { useRef, useState } from "react";
import CharacterGrid from "./components/CharacterGrid";
import EventArchive from "./components/EventArchive";
import EventDialog from "./components/EventDialog";
import Header from "./components/Header";
import ParticleWordmark from "./components/ParticleWordmark";
import SeasonLab from "./components/SeasonLab";
import usePageEffects from "./hooks/usePageEffects";

export default function App() {
  const [activeSeason, setActiveSeason] = useState(0);
  const [activeEvent, setActiveEvent] = useState(null);
  const returnFocusRef = useRef(null);
  usePageEffects();

  const handleSeasonStory = (index) => {
    setActiveSeason(index);
    document.querySelector("#seasonStage")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
  };

  const handleOpenEvent = (index, trigger) => {
    returnFocusRef.current = trigger;
    setActiveEvent(index);
  };

  return (
    <>
    <a className="skip-link" href="#main">跳到主要内容</a>

    <div className="loader" id="loader" aria-hidden="true">
      <div className="loader__formula">
        <span className="element-tile element-tile--large">
          <small>35</small>
          <strong>Br</strong>
          <em>Bromine</em>
        </span>
        <span className="loader__bond"></span>
        <span className="element-tile element-tile--large">
          <small>56</small>
          <strong>Ba</strong>
          <em>Barium</em>
        </span>
      </div>
      <p>正在建立反应条件</p>
      <div className="loader__bar"><span></span></div>
    </div>

    <div className="page-progress" aria-hidden="true"><span id="pageProgress"></span></div>
    <div className="ambient-noise" aria-hidden="true"></div>

    <Header />

    <main id="main">
      <section className="particle-intro" id="top" aria-label="Breaking Bad 粒子交互">
        <ParticleWordmark />
        <button className="scroll-cue" type="button" data-scroll="#story-intro" aria-label="向下探索剧情">
          <span>SCROLL TO REACT</span>
          <i><b></b></i>
        </button>
      </section>

      <section className="hero" id="story-intro" aria-labelledby="hero-title">
        <canvas id="chemCanvas" aria-hidden="true"></canvas>
        <div className="hero__grid" aria-hidden="true"></div>
        <div className="desert-layer desert-layer--far" aria-hidden="true"></div>
        <div className="desert-layer desert-layer--near" aria-hidden="true"></div>

        <div className="hero__content shell">
          <div className="hero__copy reveal">
            <div className="eyebrow">
              <span>ALBUQUERQUE · NEW MEXICO</span>
              <b>2008—2010</b>
            </div>

            <h1 id="hero-title">
              <span className="hero__line">每一次选择</span>
              <span className="hero__line hero__line--acid">都在改变反应式</span>
            </h1>

            <p className="hero__lead">
              一位普通化学老师，在绝境中点燃第一簇蓝色火焰。
              从“为了家人”到“为了自己”，他制造的不只是毒品，还有一场无法逆转的人性连锁反应。
            </p>

            <div className="hero__actions">
              <a className="button button--primary magnetic" href="#timeline">
                <span>进入剧情时间线</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="button button--ghost magnetic" href="#characters">
                <span>打开人物档案</span>
              </a>
            </div>

            <div className="hero__meta">
              <div><strong>05</strong><span>季</span></div>
              <i></i>
              <div><strong>62</strong><span>集</span></div>
              <i></i>
              <div><strong>01</strong><span>场蜕变</span></div>
            </div>
          </div>

          <div className="hero__visual reveal" data-delay="180">
            <div className="scene-3d" id="heroScene" aria-label="旋转的化学元素立方体装置">
              <div className="scene-3d__aura"></div>

              <div className="orbital orbital--one" aria-hidden="true">
                <i></i><i></i><i></i>
              </div>
              <div className="orbital orbital--two" aria-hidden="true">
                <i></i><i></i>
              </div>

              <div className="chem-cube-wrap">
                <div className="chem-cube">
                  <div className="chem-cube__face chem-cube__face--front">
                    <small>35</small><b>Br</b><span>Bromine</span>
                  </div>
                  <div className="chem-cube__face chem-cube__face--back">
                    <small>56</small><b>Ba</b><span>Barium</span>
                  </div>
                  <div className="chem-cube__face chem-cube__face--right">
                    <small>62</small><b>Ep</b><span>Episodes</span>
                  </div>
                  <div className="chem-cube__face chem-cube__face--left">
                    <small>05</small><b>S</b><span>Seasons</span>
                  </div>
                  <div className="chem-cube__face chem-cube__face--top">
                    <small>ABQ</small><b>505</b><span>New Mexico</span>
                  </div>
                  <div className="chem-cube__face chem-cube__face--bottom">
                    <small>He</small><b>W.W.</b><span>Heisenberg</span>
                  </div>
                </div>
              </div>

              <div className="crystal-cluster crystal-cluster--left" aria-hidden="true">
                <i></i><i></i><i></i><i></i>
              </div>
              <div className="crystal-cluster crystal-cluster--right" aria-hidden="true">
                <i></i><i></i><i></i>
              </div>

              <div className="floating-label floating-label--top">
                <span>REACTION</span>
                <b>进行中</b>
              </div>
              <div className="floating-label floating-label--bottom">
                <span>PURITY</span>
                <b>99.1%</b>
              </div>
            </div>
          </div>
        </div>

        <button className="scroll-cue" type="button" data-scroll="#premise" aria-label="向下滚动">
          <span>SCROLL TO REACT</span>
          <i><b></b></i>
        </button>
      </section>

      <section className="signal-strip" aria-label="剧情主题">
        <div className="signal-strip__track">
          <span>CHEMISTRY IS CHANGE</span><i>◆</i>
          <span>EVERY CHOICE HAS A HALF-LIFE</span><i>◆</i>
          <span>FROM WALTER WHITE TO HEISENBERG</span><i>◆</i>
          <span>CHEMISTRY IS CHANGE</span><i>◆</i>
          <span>EVERY CHOICE HAS A HALF-LIFE</span><i>◆</i>
          <span>FROM WALTER WHITE TO HEISENBERG</span><i>◆</i>
        </div>
      </section>

      <section className="premise section" id="premise" aria-labelledby="premise-title">
        <div className="shell">
          <header className="section-heading reveal">
            <div className="section-index"><span>01</span><i></i><b>反应起点</b></div>
            <div>
              <p className="kicker">THE CATALYST</p>
              <h2 id="premise-title">当生存成为借口，<br />欲望便有了化学式。</h2>
            </div>
            <p className="section-heading__note">
              故事的真正问题从来不是“他为什么开始”，而是“他究竟在何时决定不再停下”。
            </p>
          </header>

          <div className="premise__layout">
            <article className="case-file tilt-card reveal" data-tilt>
              <div className="case-file__corner">CASE 737</div>
              <div className="case-file__topline">
                <span>SUBJECT: WALTER H. WHITE</span>
                <span>STATUS: VOLATILE</span>
              </div>
              <div className="case-file__body">
                <div className="case-file__portrait case-file__portrait--photo">
                  <img
                    src="/assets/characters/walter.png"
                    alt="沃尔特·怀特戴着海森堡帽子的角色宣传照"
                  />
                  <div className="portrait-lines"></div>
                  <span>W</span>
                  <b>H</b>
                  <i>W</i>
                </div>
                <div className="case-file__data">
                  <span className="redaction">PERSONAL HISTORY</span>
                  <h3>一个被低估的人<br />如何创造自己的王国</h3>
                  <p>
                    癌症诊断是催化剂，贫困与不甘是反应物。
                    但随着权力、尊严与控制欲不断升温，原本用于保护家庭的方案，最终将家庭推向爆炸中心。
                  </p>
                  <dl>
                    <div><dt>初始身份</dt><dd>高中化学教师</dd></div>
                    <div><dt>反应条件</dt><dd>绝症 / 债务 / 自尊</dd></div>
                    <div><dt>最终产物</dt><dd>Heisenberg</dd></div>
                  </dl>
                </div>
              </div>
              <div className="case-file__stamp">CLASSIFIED</div>
              <div className="case-file__shine"></div>
            </article>

            <aside className="reaction-column reveal" data-delay="120">
              <div className="reaction-equation">
                <div className="reaction-equation__node">
                  <span>01</span><strong>恐惧</strong><small>FEAR</small>
                </div>
                <b>+</b>
                <div className="reaction-equation__node">
                  <span>02</span><strong>自尊</strong><small>PRIDE</small>
                </div>
                <b>+</b>
                <div className="reaction-equation__node">
                  <span>03</span><strong>权力</strong><small>POWER</small>
                </div>
                <b>=</b>
                <div className="reaction-equation__node reaction-equation__node--result">
                  <span>99.1</span><strong>海森堡</strong><small>HEISENBERG</small>
                </div>
              </div>
              <div className="reaction-note">
                <span>核心命题</span>
                <p>化学研究变化，剧情审视一个人如何在变化中暴露真正的自己。</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="characters section section--dark" id="characters" aria-labelledby="characters-title">
        <div className="characters__glow" aria-hidden="true"></div>
        <div className="shell">
          <header className="section-heading section-heading--light reveal">
            <div className="section-index"><span>02</span><i></i><b>人物档案</b></div>
            <div>
              <p className="kicker">THE COMPOUNDS</p>
              <h2 id="characters-title">每个人，都是<br />反应中的变量。</h2>
            </div>
            <p className="section-heading__note">
              点击人物卡片翻转档案。正面是他们被看见的身份，背面是他们真正推动剧情的力量。
            </p>
          </header>

          <CharacterGrid />
        </div>
      </section>

      <section className="timeline section" id="timeline" aria-labelledby="timeline-title">
        <div className="timeline__topography" aria-hidden="true"></div>
        <div className="shell">
          <header className="section-heading reveal">
            <div className="section-index"><span>03</span><i></i><b>剧情流程</b></div>
            <div>
              <p className="kicker">THE REACTION PATH</p>
              <h2 id="timeline-title">五个阶段，<br />一条不可逆路径。</h2>
            </div>
            <p className="section-heading__note">
              选择季数观察“反应温度”的变化，再沿时间线回看帝国如何从一辆房车扩散到整座城市。
            </p>
          </header>

          <SeasonLab activeIndex={activeSeason} onSelect={setActiveSeason} />

          <div className="story-road">
            <div className="story-road__line" aria-hidden="true">
              <span id="storyLineProgress"></span>
            </div>

            <article className="story-beat reveal" data-season-link="0" onDoubleClick={() => handleSeasonStory(0)}>
              <div className="story-beat__marker"><span>01</span><i></i></div>
              <div className="story-beat__card tilt-card" data-tilt>
                <div className="story-beat__meta"><span>S01</span><b>IGNITION</b><time>2008</time></div>
                <h3>诊断、房车与第一次越界</h3>
                <p>
                  沃尔特确诊肺癌后，与杰西组成最不稳定的搭档。
                  在荒漠房车中，他用化学天赋制造出高纯度产品，也用化学第一次解决致命威胁。
                </p>
                <ul>
                  <li>癌症成为催化剂</li>
                  <li>蓝色产品初次出现</li>
                  <li>“为了家人”的叙事成立</li>
                </ul>
              </div>
              <div className="story-beat__ghost">01</div>
            </article>

            <article className="story-beat story-beat--right reveal" data-season-link="1" onDoubleClick={() => handleSeasonStory(1)}>
              <div className="story-beat__marker"><span>02</span><i></i></div>
              <div className="story-beat__card tilt-card" data-tilt>
                <div className="story-beat__meta"><span>S02</span><b>DIFFUSION</b><time>2008—09</time></div>
                <h3>产品扩散，后果开始连锁</h3>
                <p>
                  图科带来的暴力让二人看见市场规则；索尔与古斯先后出现，
                  地下产业链逐渐成形。与此同时，谎言、悲剧与偶然在城市上空汇合。
                </p>
                <ul>
                  <li>街头交易转向系统分销</li>
                  <li>家庭关系出现结构性裂缝</li>
                  <li>个人选择形成公共灾难</li>
                </ul>
              </div>
              <div className="story-beat__ghost">02</div>
            </article>

            <article className="story-beat reveal" data-season-link="2" onDoubleClick={() => handleSeasonStory(2)}>
              <div className="story-beat__marker"><span>03</span><i></i></div>
              <div className="story-beat__card tilt-card" data-tilt>
                <div className="story-beat__meta"><span>S03</span><b>PRESSURE</b><time>2009</time></div>
                <h3>超级实验室里的高压反应</h3>
                <p>
                  沃尔特进入古斯的工业化体系，却无法接受自己只是可替换的技术环节。
                  杰西的失控、汉克的追查与盖尔的存在，将各方推到临界点。
                </p>
                <ul>
                  <li>地下实验室投入运转</li>
                  <li>师徒关系转为相互依赖</li>
                  <li>替代方案触发致命选择</li>
                </ul>
              </div>
              <div className="story-beat__ghost">03</div>
            </article>

            <article className="story-beat story-beat--right reveal" data-season-link="3" onDoubleClick={() => handleSeasonStory(3)}>
              <div className="story-beat__marker"><span>04</span><i></i></div>
              <div className="story-beat__card tilt-card" data-tilt>
                <div className="story-beat__meta"><span>S04</span><b>DETONATION</b><time>2009</time></div>
                <h3>两位操盘者的零和棋局</h3>
                <p>
                  古斯试图彻底移除风险，沃尔特则用更危险的方式证明自己不可被清除。
                  操控杰西、制造怀疑、利用复仇，最终把长期积累的压力集中引爆。
                </p>
                <ul>
                  <li>信任成为最稀缺的资源</li>
                  <li>毒物被用作心理武器</li>
                  <li>护理院爆炸终结旧秩序</li>
                </ul>
              </div>
              <div className="story-beat__ghost">04</div>
            </article>

            <article className="story-beat reveal" data-season-link="4" onDoubleClick={() => handleSeasonStory(4)}>
              <div className="story-beat__marker"><span>05</span><i></i></div>
              <div className="story-beat__card tilt-card" data-tilt>
                <div className="story-beat__meta"><span>S05</span><b>FALLOUT</b><time>2009—10</time></div>
                <h3>帝国登顶，然后全面沉降</h3>
                <p>
                  没有古斯之后，沃尔特亲自建立帝国。
                  但汉克在最日常的瞬间发现真相，所有被推迟的代价由此同时抵达：家庭、伙伴与身份一起崩塌。
                </p>
                <ul>
                  <li>磁铁、列车与海外扩张</li>
                  <li>“W.W.”让追猎回到家中</li>
                  <li>最终清算发生在实验室</li>
                </ul>
              </div>
              <div className="story-beat__ghost">05</div>
            </article>
          </div>
        </div>
      </section>

      <section className="events section section--acid" id="events" aria-labelledby="events-title">
        <div className="events__mesh" aria-hidden="true"></div>
        <div className="shell">
          <header className="section-heading section-heading--light reveal">
            <div className="section-index"><span>04</span><i></i><b>关键事件</b></div>
            <div>
              <p className="kicker">INCIDENT ARCHIVE</p>
              <h2 id="events-title">八个瞬间，<br />改变反应方向。</h2>
            </div>
            <p className="section-heading__note">
              这不是完整的事件清单，而是八个真正改变人物关系与权力结构的转折点。点击档案查看影响。
            </p>
          </header>

          <EventArchive onOpen={handleOpenEvent} />
        </div>
      </section>

      <section className="equation section" aria-labelledby="equation-title">
        <div className="equation__sun" aria-hidden="true"></div>
        <div className="equation__road" aria-hidden="true">
          <span></span>
        </div>
        <div className="shell">
          <div className="equation__content reveal">
            <p className="kicker">THE FINAL EQUATION</p>
            <h2 id="equation-title">
              他以为自己在制造<br />
              <span>蓝色晶体</span>，<br />
              其实制造的是自己。
            </h2>
            <p>
              《Breaking Bad》的完整反应式，不是一个好人突然变坏，
              而是一个人不断用现实为选择辩护，直到再也无法区分“不得不做”与“我想要做”。
            </p>
            <a className="button button--primary magnetic" href="#top">
              <span>返回反应起点</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6M6 11l6-6 6 6" /></svg>
            </a>
          </div>

          <div className="equation__object reveal" data-delay="120" aria-hidden="true">
            <div className="hat-3d">
              <div className="hat-3d__crown"><i></i><b></b></div>
              <div className="hat-3d__brim"></div>
              <div className="hat-3d__shadow"></div>
            </div>
            <span className="equation__object-label">EVIDENCE / HAT / 01</span>
          </div>
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="shell">
        <a className="brand brand--footer" href="#top" aria-label="返回顶部">
          <span className="brand__tile"><small>35</small><b>Br</b></span>
          <span className="brand__word">eaking</span>
          <span className="brand__tile"><small>56</small><b>Ba</b></span>
          <span className="brand__word">d</span>
        </a>
        <p>一份关于选择、变化与代价的非官方互动剧情档案。人物图像仅用于剧情介绍。</p>
        <div className="footer__meta">
          <span>ABQ / 35.0844° N</span>
          <span>CASE STATUS: CLOSED</span>
        </div>
      </div>
    </footer>

    <EventDialog
      activeIndex={activeEvent}
      onChange={setActiveEvent}
      onClose={() => setActiveEvent(null)}
      returnFocusRef={returnFocusRef}
    />

        </>
  );
}
