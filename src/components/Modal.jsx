import Button from "./Button.jsx";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modalHeader">
          <h2 id="modal-title">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            닫기
          </Button>
        </div>
        <div className="modalBody">{children}</div>
      </section>
    </div>
  );
}
