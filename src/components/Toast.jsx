import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);

  const toast = useCallback((message) => {
    setMsg(message);
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 3500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={`toast ${visible ? 'show' : ''}`}>
        <div className="toast-icon">
          <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, stroke: 'var(--navy)', strokeWidth: 2.5, fill: 'none' }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span>{msg}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
