import { createContext, useCallback, useContext, useState, useRef } from "react";
import { Toast } from "./Toast";

const ToastContext = createContext(null);

const MAX_TOASTS = 3;
const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info") => {
      const id = ++idCounter.current;
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        return next.length > MAX_TOASTS ? next.slice(-MAX_TOASTS) : next;
      });
      setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
      return id;
    },
    [removeToast],
  );

  const toast = useCallback(
    {
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      warning: (msg) => addToast(msg, "warning"),
      info: (msg) => addToast(msg, "info"),
    },
    [addToast],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            message={t.message}
            duration={AUTO_DISMISS_MS}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
