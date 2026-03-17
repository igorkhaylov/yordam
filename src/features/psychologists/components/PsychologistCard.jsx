import { Link } from "react-router-dom";
import { Heart, CheckCircle2, CircleHelp } from "lucide-react";
import { useFavorites } from "../../favorites/FavoritesContext.jsx";

function getYearsLabel(years = 0) {
  if (years % 10 === 1 && years % 100 !== 11) return `${years} год`;
  if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) {
    return `${years} года`;
  }
  return `${years} лет`;
}

export function PsychologistCard({ psychologist }) {
  const {
    id,
    name,
    age,
    experienceYears,
    therapyType,
    approach,
    topics = [],
    tags = [],
    pricePerHour,
    currency = "сум",
    photoUrl,
    verified,
  } = psychologist;

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const initials = name
    ?.trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const priceNumber =
    pricePerHour != null ? pricePerHour.toLocaleString("ru-RU") : null;

  const chips = [
    therapyType,
    approach,
    ...topics,
    ...tags,
  ].filter(Boolean).slice(0, 5);

  return (
    <article className="w-full min-w-0 overflow-hidden rounded-[24px] bg-white px-5 py-5 shadow-[0_18px_42px_rgba(67,142,229,0.16)]">
      {/* Верх: аватар, имя, опыт, избранное */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Аватар круглой формы */}
          <Link
            to={`/psychologists/${id}`}
            className="flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-full bg-[#F3F7FF]"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="h-[60px] w-[60px] object-cover"
              />
            ) : (
              <span className="text-[20px] font-semibold text-[#1F98FA]">
                {initials || "П"}
              </span>
            )}
          </Link>

          <div className="flex min-w-0 flex-col gap-0.5">
            {/* Проверен Yordam */}
            <div className="flex items-center gap-1 text-[11px] text-[#6F7A89]">
              {verified && (
                <CheckCircle2 className="h-3 w-3 text-[#1F98FA]" />
              )}
              <span className={verified ? "text-[#1F98FA]" : ""}>
                Проверен Yordam
              </span>
            </div>

            {/* Имя */}
            <Link
              to={`/psychologists/${id}`}
              className="block truncate text-[15px] font-semibold text-[#071A34] hover:text-[#1F98FA] transition-colors"
            >
              {name}
            </Link>

            {/* Возраст + опыт */}
            <p className="text-[12px] text-[#6F7A89]">
              {age ? `${age} лет` : "Возраст не указан"} •{" "}
              {experienceYears
                ? `Опыт ${getYearsLabel(experienceYears)}`
                : "Опыт не указан"}
            </p>

            {/* Соответствие запросу */}
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#9BA6B5]">
              <CircleHelp className="h-3 w-3" />
              <span>Соответствует вашему запросу</span>
            </div>
          </div>
        </div>

        {/* Избранное */}
        <button
          type="button"
          onClick={() => toggleFavorite(id)}
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-[#1F98FA] transition ${
            favorite
              ? "border-[#1F98FA] bg-[#E8F4FF]"
              : "border-[#D6DEE9] bg-white hover:bg-[#F5F7FA]"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              favorite ? "fill-[#1F98FA] text-[#1F98FA]" : ""
            }`}
          />
        </button>
      </div>

      {/* Чипсы: виды терапии / форматы */}
      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full bg-[#F3F5F9] px-3 py-1 text-[11px] text-[#071A34]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Низ: кнопка + цена как в макете */}
      <div className="mt-5 flex items-center justify-between">
        <Link
          to={`/psychologists/${id}`}
          className="inline-flex items-center justify-center rounded-full bg-[#1F98FA] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(31,152,250,0.45)] hover:bg-[#0f84e2] transition-colors whitespace-nowrap"
        >
          Подробнее
        </Link>

        <div className="text-right leading-tight whitespace-nowrap">
          <div className="text-[14px] font-semibold text-[#1F98FA]">
            {priceNumber ?? "Цена уточняется"}
          </div>
          {priceNumber && (
            <div className="text-[11px] text-[#6F7A89]">
              {currency}/час
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
