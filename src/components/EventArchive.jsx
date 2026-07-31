import { events } from "../data";

export default function EventArchive({ onOpen }) {
  return (
    <div className="event-desk reveal">
      <div className="event-desk__surface">
        {events.map((event, index) => (
          <button
            className={`event-card${event.cardClass ? ` ${event.cardClass}` : ""}`}
            type="button"
            key={event.id}
            data-event={event.id}
            onClick={(clickEvent) => onOpen(index, clickEvent.currentTarget)}
          >
            <span className="event-card__pin"></span>
            <span
              className={`event-card__photo event-card__photo--${event.photoClass}`}
              aria-hidden="true"
            >
              <img src={event.image} alt="" loading="lazy" decoding="async" />
              <em>{event.cardCode}</em>
            </span>
            <span className="event-card__meta">
              <b>{event.caseNo}</b><time>{event.cardSeason}</time>
            </span>
            <strong>{event.title}</strong>
            <span className="event-card__summary">{event.summary}</span>
            <span className="event-card__open">OPEN FILE ↗</span>
          </button>
        ))}
      </div>
      <div className="event-desk__legend">
        <span><i></i> 每一条红线，都是一段因果</span>
        <b>DEA EVIDENCE BOARD / ABQ-2008</b>
      </div>
    </div>
  );
}
