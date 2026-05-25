import React, { useState, useCallback } from "react";
import "../styles/Toast.css";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastMessage["type"], duration?: number) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info", duration = 3000) => {
      const id = Math.random().toString();
      const toast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: () => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "✕"}
        {toast.type === "info" && "ℹ"}
        {toast.type === "warning" && "⚠"}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close" onClick={onRemove}>
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
