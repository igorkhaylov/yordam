import { useState } from "react";
import { CreditCard, Plus, CheckCircle2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const MOCK_PLAN = {
  name: "Стандарт",
  price: 200000,
  currency: "сум",
  period: "мес",
  status: "active",
  nextPayment: "2026-04-17",
};

const MOCK_PAYMENTS = [
  { id: 1, date: "2026-03-17", amount: 200000, status: "paid", description: "Стандарт — ежемесячная подписка" },
  { id: 2, date: "2026-02-17", amount: 200000, status: "paid", description: "Стандарт — ежемесячная подписка" },
  { id: 3, date: "2026-01-17", amount: 200000, status: "paid", description: "Стандарт — ежемесячная подписка" },
  { id: 4, date: "2025-12-17", amount: 150000, status: "paid", description: "Базовый — ежемесячная подписка" },
];

const MOCK_CARDS = [
  { id: 1, type: "Uzcard", last4: "4821", isDefault: true },
];

const PLANS = [
  { key: "free", name: "Бесплатный", price: 0, features: ["1 сессия в месяц", "Базовый подбор"] },
  { key: "standard", name: "Стандарт", price: 200000, features: ["4 сессии в месяц", "Расширенный подбор", "Чат с психологом"] },
  { key: "premium", name: "Премиум", price: 500000, features: ["Безлимит сессий", "Приоритетный подбор", "Чат + видео 24/7", "Персональный куратор"] },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatPrice(amount) {
  return amount?.toLocaleString("ru-RU") ?? "—";
}

export function ClientBillingPage() {
  const { t } = useTranslation();
  const [showPlans, setShowPlans] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const visiblePayments = historyExpanded ? MOCK_PAYMENTS : MOCK_PAYMENTS.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Текущий тариф */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h2 className="mb-1 text-2xl font-display text-[#071A34]">Оплата и тариф</h2>
        <p className="mb-6 text-sm text-[#6F7A89]">Управляйте подпиской и способами оплаты</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-6 py-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-semibold text-[#071A34]">{MOCK_PLAN.name}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F9EE] px-2.5 py-0.5 text-[11px] font-medium text-[#16A34A]">
                <CheckCircle2 className="h-3 w-3" />
                Активен
              </span>
            </div>
            <p className="mt-1 text-sm text-[#6F7A89]">
              Следующее списание: <span className="font-medium text-[#071A34]">{formatDate(MOCK_PLAN.nextPayment)}</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-[22px] font-semibold text-[#1F98FA]">
              {formatPrice(MOCK_PLAN.price)} <span className="text-[13px] font-normal text-[#6F7A89]">{MOCK_PLAN.currency}/{MOCK_PLAN.period}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPlans((v) => !v)}
          className="mt-4 text-[13px] font-medium text-[#1F98FA] hover:underline"
        >
          {showPlans ? "Скрыть тарифы" : "Сменить тариф"}
        </button>

        {showPlans && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrent = plan.key === "standard";
              return (
                <div
                  key={plan.key}
                  className={`rounded-2xl border px-5 py-5 ${
                    isCurrent
                      ? "border-[#1F98FA] bg-[#F0F7FF]"
                      : "border-[#E1E7F0] bg-white hover:border-[#1F98FA]"
                  }`}
                >
                  <h4 className="text-[15px] font-semibold text-[#071A34]">{plan.name}</h4>
                  <div className="mt-1 text-[20px] font-semibold text-[#1F98FA]">
                    {plan.price === 0 ? "Бесплатно" : `${formatPrice(plan.price)} сум/мес`}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[12px] text-[#6F7A89]">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[#1F98FA]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={isCurrent}
                    className={`mt-4 w-full rounded-full py-2 text-[13px] font-semibold transition-colors ${
                      isCurrent
                        ? "bg-[#E1E7F0] text-[#9BA6B5] cursor-default"
                        : "bg-[#1F98FA] text-white shadow-[0_10px_24px_rgba(31,152,250,0.45)] hover:bg-[#0f84e2]"
                    }`}
                  >
                    {isCurrent ? "Текущий план" : "Выбрать"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Способы оплаты */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-4 text-[18px] font-display text-[#071A34]">Способы оплаты</h3>

        <div className="space-y-3">
          {MOCK_CARDS.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#1F98FA]" />
                <div>
                  <span className="text-[14px] font-medium text-[#071A34]">{card.type} •••• {card.last4}</span>
                  {card.isDefault && (
                    <span className="ml-2 text-[11px] text-[#1F98FA]">Основная</span>
                  )}
                </div>
              </div>
              <button type="button" className="text-[12px] text-[#FF4D3D] hover:underline">
                Удалить
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-4 flex items-center gap-2 rounded-full border border-[#D6DEE9] px-5 py-2.5 text-[13px] text-[#071A34] hover:border-[#1F98FA] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#1F98FA]" />
          Добавить карту
        </button>
      </div>

      {/* История платежей */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-4 text-[18px] font-display text-[#071A34]">История платежей</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#E1E7F0] text-[11px] uppercase tracking-wide text-[#9BA6B5]">
                <th className="pb-3 pr-4 font-medium">Дата</th>
                <th className="pb-3 pr-4 font-medium">Описание</th>
                <th className="pb-3 pr-4 font-medium text-right">Сумма</th>
                <th className="pb-3 font-medium text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((p) => (
                <tr key={p.id} className="border-b border-[#F2F5FB] last:border-0">
                  <td className="py-3 pr-4 text-[#071A34]">{formatDate(p.date)}</td>
                  <td className="py-3 pr-4 text-[#6F7A89]">{p.description}</td>
                  <td className="py-3 pr-4 text-right font-medium text-[#071A34]">{formatPrice(p.amount)} сум</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F9EE] px-2 py-0.5 text-[11px] font-medium text-[#16A34A]">
                      <CheckCircle2 className="h-3 w-3" />
                      Оплачено
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {MOCK_PAYMENTS.length > 3 && (
          <button
            type="button"
            onClick={() => setHistoryExpanded((v) => !v)}
            className="mt-4 flex items-center gap-1 text-[13px] text-[#1F98FA] hover:underline"
          >
            {historyExpanded ? "Свернуть" : "Показать все"}
            {historyExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default ClientBillingPage;
