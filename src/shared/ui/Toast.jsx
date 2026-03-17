import { useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: {
    bg: "bg-[#E8F9EE]",
    border: "border-[#16A34A]",
    icon: "text-[#16A34A]",
    bar: "bg-[#16A34A]",
  },
  error: {
    bg: "bg-[#FFECEC]",
    border: "border-[#FF4D3D]",
    icon: "text-[#FF4D3D]",
    bar: "bg-[#FF4D3D]",
  },
  warning: {
    bg: "bg-[#FFF8E1]",
    border: "border-[#F59E0B]",
    icon: "text-[#F59E0B]",
    bar: "bg-[#F59E0B]",
  },
  info: {
    bg: "bg-[#ECF7FF]",
    border: "border-[#1F98FA]",
    icon: "text-[#1F98FA]",
    bar: "bg-[#1F98FA]",
  },
};

export function Toast({ type = "info", message, duration = 4000, onClose }) {
  const Icon = ICON_MAP[type];
  const colors = COLOR_MAP[type];
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "100%";
    // force reflow
    bar.getBoundingClientRect();
    bar.style.transition = `width ${duration}ms linear`;
    bar.style.width = "0%";
  }, [duration]);

  return (
    <div
      className={`relative w-72 overflow-hidden rounded-xl border ${colors.border} ${colors.bg} shadow-lg animate-[slideIn_0.25s_ease-out]`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Icon size={20} className={`mt-0.5 shrink-0 ${colors.icon}`} />
        <p className="flex-1 text-sm font-medium text-[#071A34]">{message}</p>
        <button
          onClick={onClose}
          className="shrink-0 text-[#9BA6B5] transition-colors hover:text-[#071A34]"
        >
          <X size={16} />
        </button>
      </div>
      <div className="h-1 w-full">
        <div ref={barRef} className={`h-full ${colors.bar}`} />
      </div>
    </div>
  );
}
