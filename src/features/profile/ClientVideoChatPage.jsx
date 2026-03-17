import { useState } from "react";
import { Video, Calendar, Clock, Mic, Camera, Monitor, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const MOCK_UPCOMING = {
  id: 1,
  psychologistName: "Анна Реутова",
  psychologistPhoto: null,
  date: "2026-03-19",
  time: "14:00",
  duration: 50,
  status: "scheduled",
};

const MOCK_HISTORY = [
  { id: 2, psychologistName: "Анна Реутова", date: "2026-03-12", time: "14:00", duration: 50, status: "completed" },
  { id: 3, psychologistName: "Анна Реутова", date: "2026-03-05", time: "14:00", duration: 50, status: "completed" },
  { id: 4, psychologistName: "Гатс Берсеркович", date: "2026-02-20", time: "10:00", duration: 50, status: "cancelled" },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function getStatusBadge(status) {
  switch (status) {
    case "completed":
      return <span className="rounded-full bg-[#E8F9EE] px-2.5 py-0.5 text-[11px] font-medium text-[#16A34A]">Завершена</span>;
    case "cancelled":
      return <span className="rounded-full bg-[#FFECEC] px-2.5 py-0.5 text-[11px] font-medium text-[#FF4D3D]">Отменена</span>;
    case "scheduled":
      return <span className="rounded-full bg-[#E8F4FF] px-2.5 py-0.5 text-[11px] font-medium text-[#1F98FA]">Запланирована</span>;
    default:
      return null;
  }
}

export function ClientVideoChatPage() {
  const { t } = useTranslation();
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const visibleHistory = historyExpanded ? MOCK_HISTORY : MOCK_HISTORY.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Ближайшая сессия */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h2 className="mb-1 text-2xl font-display text-[#071A34]">Видеочат</h2>
        <p className="mb-6 text-sm text-[#6F7A89]">Онлайн-сессии с вашим психологом</p>

        {MOCK_UPCOMING ? (
          <div className="rounded-2xl border border-[#1F98FA] bg-[#F0F7FF] px-6 py-5">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-[#1F98FA]">
              <Video className="h-4 w-4" />
              Ближайшая сессия
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-[#071A34]">
                  {MOCK_UPCOMING.psychologistName}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-[13px] text-[#6F7A89]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#1F98FA]" />
                    {formatDate(MOCK_UPCOMING.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#1F98FA]" />
                    {MOCK_UPCOMING.time} ({MOCK_UPCOMING.duration} мин)
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#1F98FA] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(31,152,250,0.45)] hover:bg-[#0f84e2] transition-colors"
              >
                <Video className="h-4 w-4" />
                Подключиться
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-6 py-8 text-center">
            <Video className="mx-auto h-8 w-8 text-[#D6DEE9]" />
            <p className="mt-3 text-[14px] text-[#6F7A89]">Нет запланированных сессий</p>
            <p className="mt-1 text-[12px] text-[#9BA6B5]">Запишитесь к психологу через каталог специалистов</p>
          </div>
        )}
      </div>

      {/* Подготовка к сессии */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-4 text-[18px] font-display text-[#071A34]">Подготовка к сессии</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-4 py-4">
            <Camera className="mt-0.5 h-5 w-5 shrink-0 text-[#1F98FA]" />
            <div>
              <h4 className="text-[13px] font-semibold text-[#071A34]">Камера</h4>
              <p className="mt-1 text-[12px] text-[#6F7A89]">Убедитесь, что камера работает и лицо хорошо освещено</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-4 py-4">
            <Mic className="mt-0.5 h-5 w-5 shrink-0 text-[#1F98FA]" />
            <div>
              <h4 className="text-[13px] font-semibold text-[#071A34]">Микрофон</h4>
              <p className="mt-1 text-[12px] text-[#6F7A89]">Используйте наушники для лучшего качества звука</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-4 py-4">
            <Monitor className="mt-0.5 h-5 w-5 shrink-0 text-[#1F98FA]" />
            <div>
              <h4 className="text-[13px] font-semibold text-[#071A34]">Интернет</h4>
              <p className="mt-1 text-[12px] text-[#6F7A89]">Стабильное соединение от 5 Мбит/с для видеозвонка</p>
            </div>
          </div>
        </div>
      </div>

      {/* История сессий */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-4 text-[18px] font-display text-[#071A34]">История сессий</h3>

        {MOCK_HISTORY.length === 0 ? (
          <p className="text-[13px] text-[#6F7A89]">Пока нет завершённых сессий</p>
        ) : (
          <>
            <div className="space-y-3">
              {visibleHistory.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#E1E7F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h4 className="text-[14px] font-medium text-[#071A34]">{session.psychologistName}</h4>
                    <div className="mt-1 flex items-center gap-3 text-[12px] text-[#6F7A89]">
                      <span>{formatDate(session.date)}</span>
                      <span>{session.time} • {session.duration} мин</span>
                    </div>
                  </div>
                  {getStatusBadge(session.status)}
                </div>
              ))}
            </div>

            {MOCK_HISTORY.length > 2 && (
              <button
                type="button"
                onClick={() => setHistoryExpanded((v) => !v)}
                className="mt-4 flex items-center gap-1 text-[13px] text-[#1F98FA] hover:underline"
              >
                {historyExpanded ? "Свернуть" : "Показать все"}
                {historyExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClientVideoChatPage;
