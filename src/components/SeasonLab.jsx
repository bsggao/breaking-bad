import { useRef } from "react";
import { seasons } from "../data";

export default function SeasonLab({ activeIndex, onSelect }) {
  const tabRefs = useRef([]);
  const activeSeason = seasons[activeIndex];

  const handleKeyDown = (event, index) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + seasons.length) % seasons.length;
    onSelect(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="season-lab reveal">
      <div className="season-tabs" role="tablist" aria-label="选择季度">
        {seasons.map((season, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              className={`season-tab${isActive ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              key={season.number}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span>{season.number}</span><b>{season.short}</b>
            </button>
          );
        })}
      </div>

      <div className="season-stage" id="seasonStage" style={{ "--active-season": activeIndex }}>
        <div className="season-stage__copy is-changing" aria-live="polite" key={activeIndex}>
          <span className="season-stage__label">{activeSeason.label}</span>
          <h3>{activeSeason.title}</h3>
          <p>{activeSeason.text}</p>
          <div className="temperature">
            <span>反应温度</span>
            <i><b style={{ width: `${activeSeason.temperature}%` }}></b></i>
            <strong>{activeSeason.temperature}%</strong>
          </div>
        </div>

        <div className="season-helix" aria-hidden="true">
          {seasons.map((season, index) => (
            <div className="season-slab" style={{ "--i": index }} key={season.number}>
              <span>{season.roman}</span><b>{season.phase}</b><i></i>
            </div>
          ))}
          <div className="season-helix__core"></div>
        </div>
      </div>
    </div>
  );
}
