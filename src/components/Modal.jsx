import { useState, useCallback } from 'react';

export default function Modal({ isOpen, onClose, title, large, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && onClose()}>
      <div className={`modal ${large ? 'modal-lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return { isOpen, open, close };
}
