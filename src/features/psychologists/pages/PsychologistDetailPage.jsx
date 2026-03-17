import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

import { MainLayout } from "../../../components/layout/MainLayout.jsx";
import { useFavorites } from "../../favorites/FavoritesContext.jsx";
import { getPsychologistsList } from "../../../shared/api/api";
import { useTranslation } from "react-i18next";

// Мок-отзывы: текст и роль берём из i18n по key
const mockReviews = [
  { id: 1, name: "Leslie Alexander", key: "r1" },
  { id: 2, name: "Jenny Wilson", key: "r2" },
  { id: 3, name: "Michael Smith", key: "r3" },
  { id: 4, name: "Emily Jones", key: "r4" },
];

export function PsychologistDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const reviewsRef = useRef(null);

  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const list = await getPsychologistsList();
        const found = list.find((p) => String(p.id) === String(id));

        if (!cancelled) {
          setPsychologist(found || null);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e?.message || "Ошибка загрузки данных");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, i18n.language]);

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full px-4 lg:px-12 xl:px-[72px] py-10">
          <p className="text-[#071A34] text-[16px]">
            {t("psychDetail.loading")}
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="w-full px-4 lg:px-12 xl:px-[72px] py-10">
          <p className="text-[16px] text-red-500 mb-3">
            {t("psychDetail.error.prefix")} {error}
          </p>
          <Link to="/psychologists" className="text-[#1F98FA] underline">
            {t("psychDetail.error.backLink")}
          </Link>
        </div>
      </MainLayout>
    );
  }

  if (!psychologist) {
    return (
      <MainLayout>
        <div className="w-full px-4 lg:px-12 xl:px-[72px] py-10">
          <p className="text-[#071A34] text-[16px]">
            {t("psychDetail.notFound.text")}{" "}
            <Link to="/psychologists" className="text-[#1F98FA] underline">
              {t("psychDetail.notFound.backLink")}
            </Link>
          </p>
        </div>
      </MainLayout>
    );
  }

  const {
    name,
    age,
    experienceYears,
    about,
    approach,
    therapyType,
    topics = [],
    tags = [],
    pricePerHour,
    currency = "сум",
    verified,
    education = [],
    certificates = [],
    photoUrl,
  } = psychologist;

  const isFavorite =
    favoriteIds.includes(String(psychologist.id)) ||
    favoriteIds.includes(psychologist.id);

  const initials = name
    ?.trim()
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const priceText =
    pricePerHour != null
      ? t("psychDetail.header.pricePerHour", {
        price: pricePerHour.toLocaleString("ru-RU"),
        currency,
      })
      : t("psychDetail.header.priceTBD");

  const handleScrollLeft = () => {
    if (!reviewsRef.current) return;
    reviewsRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    if (!reviewsRef.current) return;
    reviewsRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <MainLayout>
      <div className="w-full px-4 lg:px-10 xl:px-12 py-12">
        <div className="mx-auto max-w-[1320px]">
          {/* Хлебные крошки */}
          <div className="mb-5 flex flex-wrap items-center gap-1 text-[13px] text-[#9BA6B5]">
            <Link
              to="/"
              className="hover:text-[#1F98FA] transition-colors"
            >
              {t("psychDetail.breadcrumbs.home")}
            </Link>
            <span>›</span>
            <Link
              to="/psychologists"
              className="hover:text-[#1F98FA] transition-colors"
            >
              {t("psychDetail.breadcrumbs.list")}
            </Link>
            <span>›</span>
            <span className="text-[#071A34] truncate max-w-[260px]">
              {name}
            </span>
          </div>

          {/* Заголовок страницы */}
          <h1 className="mb-8 font-display text-[32px] md:text-[38px] text-[#1F98FA] leading-tight">
            {t("psychDetail.title")}
          </h1>

          {/* Основной блок: фото + инфо */}
          <section className="rounded-[40px] bg-white px-7 py-8 md:px-10 md:py-10 shadow-[0_26px_70px_rgba(67,142,229,0.16)] flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Левая колонка: фото + кнопки */}
            <div className="w-full max-w-[280px] flex flex-col items-center lg:items-start gap-4">
              <div className="flex h-[280px] w-[280px] items-center justify-center rounded-[40px] bg-[#F3F7FF] overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={name}
                    className="h-[280px] w-[280px] object-cover"
                  />
                ) : (
                  <div className="flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[#1F98FA] text-[60px] font-semibold text-white">
                    {initials || "П"}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="mt-2 w-full rounded-full bg-[#1F98FA] py-3.5 text-[14px] font-semibold text-white shadow-[0_16px_32px_rgba(31,152,250,0.55)] hover:bg-[#0f84e2] transition-colors"
              >
                {t("psychDetail.buttons.book")}
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(psychologist.id)}
                className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-[13px] transition ${isFavorite
                    ? "border-[#1F98FA] bg-[#E8F4FF] text-[#1F98FA]"
                    : "border-[#D6DEE9] bg-white text-[#071A34] hover:bg-[#F5F7FA]"
                  }`}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite
                      ? "fill-[#1F98FA] text-[#1F98FA]"
                      : "text-[#1F98FA]"
                    }`}
                />
                <span>
                  {isFavorite
                    ? t("psychDetail.buttons.favoriteIn")
                    : t("psychDetail.buttons.favoriteAdd")}
                </span>
              </button>
            </div>

            {/* Правая колонка: текст */}
            <div className="flex-1">
              {/* Шапка: имя, опыт, цена */}
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-[640px]">
                  <p className="flex items-center gap-2 text-[12px] text-[#9BA6B5]">
                    {verified && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1F98FA]" />
                    )}
                    {verified
                      ? t("psychDetail.header.verified")
                      : t("psychDetail.header.notVerified")}
                  </p>
                  <h2 className="mt-1 text-[24px] md:text-[26px] font-semibold text-[#071A34]">
                    {name}
                  </h2>
                  <p className="mt-1 text-[13px] text-[#6F7A89]">
                    {age
                      ? t("psychDetail.header.age", { age })
                      : t("psychDetail.header.ageNotSpecified")}
                    {" • "}
                    {experienceYears
                      ? t("psychDetail.header.experience", {
                        years: experienceYears,
                      })
                      : t("psychDetail.header.experienceNotSpecified")}
                  </p>
                </div>

                <div className="text-right pt-1">
                  <div className="text-[20px] md:text-[22px] font-semibold text-[#1F98FA]">
                    {priceText}
                  </div>
                  <p className="text-[11px] text-[#9BA6B5] mt-1">
                    {t("psychDetail.header.priceNote")}
                  </p>
                </div>
              </div>

              {/* Обо мне */}
              <div className="mt-6">
                <h3 className="mb-2 text-[14px] font-semibold text-[#071A34]">
                  {t("psychDetail.about.title")}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#4B5563] max-w-[760px]">
                  {about || t("psychDetail.about.fallback")}
                </p>
              </div>

              {/* Подход + тэги */}
              <div className="mt-6">
                <h3 className="mb-2 text-[14px] font-semibold text-[#071A34]">
                  {t("psychDetail.approach.title")}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {therapyType && (
                    <span className="rounded-full bg-[#F3F7FF] px-3 py-1 text-[11px] text-[#071A34]">
                      {therapyType}
                    </span>
                  )}
                  {approach && (
                    <span className="rounded-full bg-[#F3F7FF] px-3 py-1 text-[11px] text-[#071A34]">
                      {approach}
                    </span>
                  )}
                  {[...topics, ...tags].slice(0, 6).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full bg-[#F5F7FA] px-3 py-1 text-[11px] text-[#4B5563]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Образование */}
              <section className="mt-8 mb-4">
                <h3 className="mb-3 text-[14px] font-semibold text-[#071A34]">
                  {t("psychDetail.education.title")}
                </h3>

                {education.length === 0 ? (
                  <p className="text-[13px] text-[#6F7A89]">
                    {t("psychDetail.education.empty")}
                  </p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 text-[13px] text-[#4A5568]">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <p>
                          {edu.institution}
                          {edu.endYear && <> • {edu.endYear}</>}
                        </p>
                        {edu.degree && <p>{edu.degree}</p>}
                        {edu.years && (
                          <p className="text-[12px] text-[#6F7A89]">
                            {edu.years}
                          </p>
                        )}
                        {edu.documentUrl && (
                          <a
                            href={edu.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-[12px] text-[#1F98FA] underline underline-offset-4"
                          >
                            {t("psychDetail.education.documentLink")}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Сертификаты */}
              <section className="mt-6 mb-4">
                <h3 className="mb-3 text-[14px] font-semibold text-[#071A34]">
                  {t("psychDetail.certificates.title")}
                </h3>

                {certificates.length === 0 ? (
                  <p className="text-[13px] text-[#6F7A89]">
                    {t("psychDetail.certificates.empty")}
                  </p>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 text-[13px] text-[#4A5568]">
                    {certificates.map((cert) => (
                      <div key={cert.id}>
                        <p>
                          {cert.name}
                          {cert.issuer && <> • {cert.issuer}</>}
                        </p>
                        {cert.issueDate && (
                          <p className="text-[12px] text-[#6F7A89]">
                            {t("psychDetail.certificates.issued", {
                              date: cert.issueDate,
                            })}
                          </p>
                        )}
                        {cert.expiryDate && (
                          <p className="text-[12px] text-[#6F7A89]">
                            {t("psychDetail.certificates.validUntil", {
                              date: cert.expiryDate,
                            })}
                          </p>
                        )}
                        {cert.documentUrl && (
                          <a
                            href={cert.documentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-[12px] text-[#1F98FA] underline underline-offset-4"
                          >
                            {t("psychDetail.certificates.documentLink")}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </section>

          {/* Отзывы */}
          <section className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-[26px] md:text-[30px] text-[#1F98FA]">
                {t("psychDetail.reviews.title")}
              </h2>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleScrollLeft}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6DEE9] bg-white text-[#071A34] hover:bg-[#F5F7FA] transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleScrollRight}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6DEE9] bg-white text-[#071A34] hover:bg-[#F5F7FA] transition"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={reviewsRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#D6DEE9]"
            >
              {mockReviews.map((review) => (
                <article
                  key={review.id}
                  className="min-w-[280px] max-w-[340px] flex-1 rounded-[32px] bg-white px-7 py-7 shadow-[0_18px_42px_rgba(67,142,229,0.16)]"
                >
                  <div className="mb-3 flex gap-1 text-[#FFC857] text-[14px]">
                    {"★★★★★".split("").map((star, idx) => (
                      <span key={idx}>{star}</span>
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#4B5563]">
                    {t(`psychDetail.reviews.items.${review.key}.text`)}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F7FF] text-[13px] font-semibold text-[#1F98FA]">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#071A34]">
                        {review.name}
                      </p>
                      <p className="text-[11px] text-[#9BA6B5]">
                        {t(`psychDetail.reviews.items.${review.key}.role`)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default PsychologistDetailPage;
