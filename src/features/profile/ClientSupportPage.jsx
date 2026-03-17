import { useState } from "react";
import { Send, ChevronDown, ChevronUp, Mail, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const FAQ_ITEMS = [
  {
    question: "Как отменить или перенести сессию?",
    answer: "Вы можете отменить или перенести сессию не позднее чем за 24 часа до начала. Зайдите в раздел Видеочат, найдите запланированную сессию и нажмите «Перенести» или «Отменить».",
  },
  {
    question: "Как сменить психолога?",
    answer: "Перейдите в каталог специалистов, выберите нового психолога и запишитесь к нему на сессию. Ваша текущая подписка сохранится.",
  },
  {
    question: "Как работает оплата и возврат?",
    answer: "Оплата списывается ежемесячно в день подписки. Если вы отменяете подписку до конца периода, доступ сохраняется до конца оплаченного месяца. Возврат возможен в течение 3 дней после списания.",
  },
  {
    question: "Мои данные в безопасности?",
    answer: "Все данные хранятся в зашифрованном виде. Содержание сессий конфиденциально и доступно только вам и вашему психологу. Мы не передаём данные третьим лицам.",
  },
  {
    question: "Что делать, если не работает видеосвязь?",
    answer: "Проверьте соединение с интернетом (от 5 Мбит/с), разрешите доступ к камере и микрофону в браузере. Попробуйте перезагрузить страницу. Если проблема не решена — напишите нам через форму ниже.",
  },
];

const TOPIC_OPTIONS = [
  "Проблемы с оплатой",
  "Вопрос по сессии",
  "Техническая проблема",
  "Предложение / отзыв",
  "Другое",
];

export function ClientSupportPage() {
  const { t } = useTranslation();

  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !message.trim()) return;

    setSending(true);
    // Имитация отправки
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSubmitted(true);
    setTopic("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h2 className="mb-1 text-2xl font-display text-[#071A34]">Поддержка</h2>
        <p className="text-sm text-[#6F7A89]">Ответы на частые вопросы и форма обращения</p>
      </div>

      {/* FAQ */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-5 text-[18px] font-display text-[#071A34]">Частые вопросы</h3>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E1E7F0] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#F7FAFF] transition-colors"
                >
                  <span className="pr-4 text-[14px] font-medium text-[#071A34]">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#9BA6B5]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#9BA6B5]" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-[#E1E7F0] bg-[#F7FAFF] px-5 py-4 text-[13px] leading-relaxed text-[#6F7A89]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Форма обращения */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-5 text-[18px] font-display text-[#071A34]">Написать в поддержку</h3>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#D1F5DD] bg-[#E8F9EE] py-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-[#16A34A]" />
            <div>
              <p className="text-[15px] font-semibold text-[#071A34]">Обращение отправлено</p>
              <p className="mt-1 text-[13px] text-[#6F7A89]">Мы ответим в течение 24 часов на вашу почту</p>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-[13px] font-medium text-[#1F98FA] hover:underline"
            >
              Отправить ещё одно обращение
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#071A34]">Тема обращения</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-4 py-3 text-[14px] text-[#071A34] outline-none focus:border-[#1F98FA] transition-colors"
              >
                <option value="">Выберите тему</option>
                {TOPIC_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#071A34]">Сообщение</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите вашу проблему или вопрос..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-[#E1E7F0] bg-[#F7FAFF] px-4 py-3 text-[14px] text-[#071A34] outline-none placeholder:text-[#A0AEC0] focus:border-[#1F98FA] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!topic || !message.trim() || sending}
              className="inline-flex items-center gap-2 rounded-full bg-[#1F98FA] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(31,152,250,0.45)] hover:bg-[#0f84e2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {sending ? "Отправка..." : "Отправить"}
            </button>
          </form>
        )}
      </div>

      {/* Контакты */}
      <div className="rounded-3xl bg-white px-8 py-8 shadow-[0_24px_60px_rgba(2,45,98,0.08)]">
        <h3 className="mb-4 text-[18px] font-display text-[#071A34]">Контакты</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <a
            href="mailto:support@yordam.uz"
            className="flex items-center gap-3 rounded-2xl border border-[#E1E7F0] px-5 py-4 hover:border-[#1F98FA] transition-colors"
          >
            <Mail className="h-5 w-5 text-[#1F98FA]" />
            <div>
              <div className="text-[12px] text-[#9BA6B5]">Email</div>
              <div className="text-[13px] font-medium text-[#071A34]">support@yordam.uz</div>
            </div>
          </a>

          <a
            href="tel:+998900000000"
            className="flex items-center gap-3 rounded-2xl border border-[#E1E7F0] px-5 py-4 hover:border-[#1F98FA] transition-colors"
          >
            <Phone className="h-5 w-5 text-[#1F98FA]" />
            <div>
              <div className="text-[12px] text-[#9BA6B5]">Телефон</div>
              <div className="text-[13px] font-medium text-[#071A34]">+998 90 000 00 00</div>
            </div>
          </a>

          <a
            href="https://t.me/yordam_support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-[#E1E7F0] px-5 py-4 hover:border-[#1F98FA] transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-[#1F98FA]" />
            <div>
              <div className="text-[12px] text-[#9BA6B5]">Telegram</div>
              <div className="text-[13px] font-medium text-[#071A34]">@yordam_support</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ClientSupportPage;
