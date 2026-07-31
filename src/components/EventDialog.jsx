import { useEffect, useRef } from "react";
import { events } from "../data";

export default function EventDialog({ activeIndex, onChange, onClose, returnFocusRef }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isOpen = activeIndex !== null;
  const event = events[activeIndex ?? 0];
  const previousEvent = events[((activeIndex ?? 0) - 1 + events.length) % events.length];
  const nextEvent = events[((activeIndex ?? 0) + 1) % events.length];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      document.body.classList.add("dialog-open");
      if (!dialog.open) dialog.showModal();
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      document.body.classList.remove("dialog-open");
      if (dialog.open) dialog.close();
    }

    return () => document.body.classList.remove("dialog-open");
  }, [isOpen]);

  const close = () => {
    onClose();
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  };

  const handleCancel = (cancelEvent) => {
    cancelEvent.preventDefault();
    close();
  };

  const handleKeyDown = (keyboardEvent) => {
    if (keyboardEvent.key !== "Escape") return;
    keyboardEvent.preventDefault();
    close();
  };

  const move = (direction) => {
    const nextIndex = (activeIndex + direction + events.length) % events.length;
    onChange(nextIndex);
  };

  return (
    <dialog
      className="event-dialog"
      ref={dialogRef}
      aria-labelledby="dialogTitle"
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
    >
      <div className="event-dialog__backdrop" onClick={close}></div>
      <article className="event-dialog__panel">
        <button
          className="event-dialog__close"
          type="button"
          onClick={close}
          aria-label="关闭事件档案"
          ref={closeButtonRef}
        >
          <span></span><span></span>
        </button>
        <div className="event-dialog__header">
          <span>{event.caseNo}</span>
          <b>{event.season}</b>
        </div>
        <div className="event-dialog__visual" key={`visual-${event.id}`}>
          <img
            src={event.image}
            alt={event.imageAlt}
            style={{ objectPosition: event.imagePosition }}
          />
          <em>{event.code}</em>
        </div>
        <div className="event-dialog__content" key={`content-${event.id}`}>
          <div className="event-dialog__copy">
            <p className="event-dialog__kicker">{event.kicker}</p>
            <h2 id="dialogTitle">{event.title}</h2>
            <p className="event-dialog__text">{event.text}</p>
          </div>
          <aside className="event-dialog__details" aria-label="事件影响">
            <div className="event-dialog__impact">
              <span>影响指数</span>
              <i><b key={event.id} style={{ width: `${event.impact}%` }}></b></i>
              <strong>{event.impact}%</strong>
            </div>
            <div className="event-dialog__tags">
              {event.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </aside>
        </div>
        <div className="event-dialog__nav">
          <button type="button" onClick={() => move(-1)}>
            <span>← 上一事件</span>
            <strong>{previousEvent.title}</strong>
          </button>
          <button type="button" onClick={() => move(1)}>
            <span>下一事件 →</span>
            <strong>{nextEvent.title}</strong>
          </button>
        </div>
      </article>
    </dialog>
  );
}
