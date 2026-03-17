import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

import { PsychologistCard } from "../components/PsychologistCard.jsx";
import { MainLayout } from "../../../components/layout/MainLayout.jsx";
import { getPsychologistsList } from "../../../shared/api/api";
import { useTranslation } from "react-i18next";

const ANY_VALUE = "__any";

// ===== СКЕЛЕТЫ =====

function FiltersSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-[#E3ECF5] pb-3">
          <div className="mb-2 h-4 w-32 rounded bg-[#E3ECF5]" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-[#F2F5FB]" />
            <div className="h-3 w-4/5 rounded bg-[#F2F5FB]" />
            <div className="h-3 w-2/3 rounded bg-[#F2F5FB]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PsychologistCardSkeleton() {
  return (
    <div className="rounded-[32px] bg-white p-5 shadow-[0_18px_42px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[#E3ECF5]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-[#E3ECF5]" />
          <div className="h-3 w-1/2 rounded bg-[#F2F5FB]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[#F2F5FB]" />
        <div className="h-3 w-5/6 rounded bg-[#F2F5FB]" />
      </div>
      <div className="mt-4 h-8 w-24 rounded-full bg-[#E3ECF5]" />
    </div>
  );
}

// ===== СТРАНИЦА =====

const ANY = "__any";

export function PsychologistsListPage() {
  const { t } = useTranslation();

  const [allPsychologists, setAllPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [openFilterSections, setOpenFilterSections] = useState({});
  const [sortMode, setSortMode] = useState("popular");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  // ===== 1. Загрузка списка =====
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const list = await getPsychologistsList();
        if (!cancelled) {
          setAllPsychologists(list || []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(
            e?.message || t("psychologistsList.messages.loadError")
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== 2. Сортировка =====
  const sortOptions = [
    { key: "popular", label: t("psychologistsList.sort.popular") },
    { key: "verified", label: t("psychologistsList.sort.verified") },
    { key: "new", label: t("psychologistsList.sort.new") },
  ];

  // ===== 3. Конфиг фильтров =====
  const filterConfig = useMemo(() => {
    const unique = (arr) =>
      Array.from(new Set(arr.filter(Boolean))).sort((a, b) =>
        String(a).localeCompare(String(b), "ru")
      );

    const therapyTypes = unique(allPsychologists.map((p) => p.therapyType));
    const approaches = unique(allPsychologists.map((p) => p.approach));
    const languages = unique(allPsychologists.map((p) => p.language));
    const times = unique(allPsychologists.map((p) => p.time));
    return [
      {
        key: "therapyType",
        label: t("psychologistsList.filters.therapyType.label"),
        options: [
          { value: ANY, label: t("psychologistsList.filters.common.any") },
          ...therapyTypes.map((val) => ({ value: val, label: val })),
        ],
      },
      {
        key: "approach",
        label: t("psychologistsList.filters.approach.label"),
        options: [
          { value: ANY, label: t("psychologistsList.filters.common.any") },
          ...approaches.map((val) => ({ value: val, label: val })),
        ],
      },
      {
        key: "experience",
        label: t("psychologistsList.filters.experience.label"),
        options: [
          { value: ANY, label: t("psychologistsList.filters.common.any") },
          { value: "from1", label: t("psychologistsList.filters.experience.from1") },
          { value: "from3", label: t("psychologistsList.filters.experience.from3") },
          { value: "from5", label: t("psychologistsList.filters.experience.from5") },
        ],
      },
      {
        key: "time",
        label: t("psychologistsList.filters.time.label"),
        options: [
          { value: ANY, label: t("psychologistsList.filters.time.anyTime") },
          ...times.map((val) => ({ value: val, label: val })),
        ],
      },
      {
        key: "language",
        label: t("psychologistsList.filters.language.label"),
        options: [
          { value: ANY, label: t("psychologistsList.filters.common.any") },
          ...languages.map((val) => ({ value: val, label: val })),
        ],
      },
    ];
  }, [allPsychologists, t]);

  // ===== 4. Инициализация фильтров =====
  useEffect(() => {
    if (!filterConfig.length) return;

    const initialFilters = {};
    const openSections = {};

    filterConfig.forEach((f) => {
      initialFilters[f.key] = f.options[0]?.value ?? ANY;
      openSections[f.key] = true;
    });

    setFilters(initialFilters);
    setOpenFilterSections(openSections);
    setVisibleCount(6);
  }, [filterConfig]);

  const toggleSection = (key) => {
    setOpenFilterSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisibleCount(6);
  };

  const handleResetFilters = () => {
    const reset = {};
    filterConfig.forEach((f) => {
      reset[f.key] = f.options[0]?.value ?? ANY;
    });
    setFilters(reset);
    setVisibleCount(6);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(6);
  };

  const handleChangeSort = (key) => {
    setSortMode(key);
    setSortMenuOpen(false);
    setVisibleCount(6);
  };

  // ===== 5. Фильтрация и сортировка =====
  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let list = allPsychologists.filter((p) => {
      if (query) {
        const haystack = [
          p.name,
          p.about,
          p.therapyType,
          p.approach,
          p.language,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      for (const f of filterConfig) {
        const val = filters[f.key];
        if (!val || val === ANY) continue;

        if (f.key === "therapyType" && p.therapyType !== val) return false;
        if (f.key === "approach" && p.approach !== val) return false;
        if (f.key === "language" && p.language !== val) return false;
        if (f.key === "time" && p.time !== val) return false;

        if (f.key === "experience") {
          const years = Number(p.experienceYears || 0);
          if (val === "from1" && years < 1) return false;
          if (val === "from3" && years < 3) return false;
          if (val === "from5" && years < 5) return false;
        }
      }

      return true;
    }); if (sortMode === "verified") {
      list = [...list].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    } else if (sortMode === "new") {
      list = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return list;
  }, [allPsychologists, filters, filterConfig, searchQuery, sortMode]);

  const totalFound = filteredAndSorted.length;
  const visibleList = filteredAndSorted.slice(0, visibleCount);
  const canLoadMore = visibleCount < totalFound;

  // ===== 6. Рендер фильтров (общий) =====
  const renderFiltersContent = () => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#071A34]">
          {t("psychologistsList.filters.title")}
        </h3>

        <button
          type="button"
          onClick={handleResetFilters}
          className="text-[13px] text-[#1F98FA] hover:underline"
        >
          {t("psychologistsList.filters.reset")}
        </button>
      </div>

      {loading ? (
        <FiltersSkeleton />
      ) : (
        <div className="space-y-4">
          {filterConfig.map((group) => {
            const isOpen = openFilterSections[group.key];

            return (
              <div key={group.key} className="border-b border-[#E3ECF5] pb-3">
                <button
                  type="button"
                  onClick={() => toggleSection(group.key)}
                  className="flex w-full items-center justify-between text-left text-[14px] text-[#071A34]"
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#9BA6B5] transition-transform ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <div className="mt-2 space-y-1">
                    {group.options.map((opt) => (
                      <button
                        key={opt.value ?? "any"}
                        type="button"
                        onClick={() => handleFilterChange(group.key, opt.value)}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-[13px] ${filters[group.key] === opt.value
                          ? "bg-[#ECF7FF] text-[#071A34] font-medium"
                          : "text-[#6F7A89] hover:bg-[#F5F7FA]"
                          }`}
                      >
                        <span>{opt.label}</span>
                        {filters[group.key] === opt.value && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1F98FA]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  return (
    <MainLayout>
      {/* ===== HERO / ШАПКА ===== */}
      <section className="bg-[#E5F3FF]">
        <div className="mx-auto max-w-[1920px] px-4 lg:px-[72px] py-8 md:py-10">
          <div className="max-w-[720px]">
            <h1 className="font-display text-[26px] md:text-[32px] text-[#1F98FA]">
              {t("psychologistsList.title")}
            </h1>

            {/* Хлебные крошки */}
            <div className="mt-4 text-[12px] text-[#8C9BB0]">
              <Link to="/" className="hover:text-[#1F98FA]">
                {t("psychologistsList.breadcrumbs.home")}
              </Link>
              <span className="mx-1">›</span>
              <span>{t("psychologistsList.breadcrumbs.current")}</span>
            </div> {/* Поиск */}
            <div className="mt-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A0AEC0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t("psychologistsList.search.placeholder")}
                  className="w-full rounded-full bg-white px-10 py-2.5 text-[14px] text-[#071A34] shadow-sm outline-none placeholder:text-[#A0AEC0] focus:ring-2 focus:ring-[#1F98FA]"
                />
              </div>
            </div>

            {/* Найдено + сортировка / мобильные фильтры */}
            <div className="mt-4 hidden items-center justify-between lg:flex">
              <p className="text-[13px] text-[#6F7A89]">
                {t("psychologistsList.found.prefix")} {totalFound}{" "}
                {t("psychologistsList.found.suffix")}
              </p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortMenuOpen((v) => !v)}
                  className="rounded-full bg-white px-4 py-2 text-[13px] text-[#071A34] shadow-sm hover:bg-[#F3F6FB] flex items-center gap-2"
                >
                  <span>
                    {
                      sortOptions.find((opt) => opt.key === sortMode)?.label ??
                      ""
                    }
                  </span>
                  {sortMenuOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#9BA6B5]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#9BA6B5]" />
                  )}
                </button>

                {sortMenuOpen && (
                  <div className="absolute right-0 mt-2 w-[220px] rounded-2xl border border-[#E1E8F0] bg-white py-2 shadow-[0_12px_30px_rgba(15,35,52,0.16)] z-20">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleChangeSort(opt.key)}
                        className={`flex w-full items-center justify-between px-4 py-2 text-left text-[13px] ${sortMode === opt.key
                          ? "bg-[#F0F7FF] text-[#1F98FA] font-semibold"
                          : "text-[#071A34] hover:bg-[#F7FAFF]"
                          }`}
                      >
                        <span>{opt.label}</span>
                        {sortMode === opt.key && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1F98FA]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* мобилка: найдено + кнопка фильтров */}
            <div className="mt-4 flex items-center justify-between lg:hidden">
              <p className="text-[12px] text-[#6F7A89]">
                {t("psychologistsList.found.prefix")} {totalFound}{" "}
                {t("psychologistsList.found.suffix")}
              </p>

              <button
                type="button"
                onClick={() => setFiltersModalOpen(true)}
                className="rounded-full bg-[#1F98FA] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_22px_rgba(31,152,250,0.45)]"
              >
                {t("psychologistsList.filters.title")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== КОНТЕНТ ===== */}
      <section className="bg-[#F7FBFF] py-8 md:py-12">
        <div className="mx-auto max-w-[1920px] px-4 lg:px-[72px]">
          {error && (
            <div className="mb-4 rounded-2xl bg-[#FFECEC] px-4 py-3 text-[13px] text-[#B00020]">
              {error}
            </div>
          )}

          <div className="mt-2 flex flex-col gap-6 lg:mt-0 lg:flex-row">
            {/* Фильтры (desktop) */}
            <aside className="hidden w-full shrink-0 lg:block" style={{ width: '260px' }}>
              <div className="rounded-[32px] bg-white p-5 shadow-[0_18px_42px_rgba(0,0,0,0.06)]">
                {renderFiltersContent()}
              </div>
            </aside>

            {/* Список */}
            <div className="min-w-0 flex-1">
              {loading && !allPsychologists.length && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <PsychologistCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {!loading && !visibleList.length && (
                <p className="text-[14px] text-[#6F7A89]">
                  {t("psychologistsList.messages.empty")}
                </p>
              )}

              {!loading && !!visibleList.length && (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                    {visibleList.map((psy) => (
                      <PsychologistCard key={psy.id} psychologist={psy} />
                    ))}
                  </div>

                  {canLoadMore && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleCount((prev) => prev + 6)
                        }
                        className="rounded-full bg-white px-6 py-2 text-[14px] font-semibold text-[#1F98FA] shadow-[0_10px_22px_rgba(15,23,52,0.18)] hover:bg-[#F3F6FB] transition"
                      >
                        {t("psychologistsList.loadMore")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== МОДАЛКА ФИЛЬТРОВ (мобилка) ===== */}
      {filtersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(15,23,42,0.45)]"
            onClick={() => setFiltersModalOpen(false)}
          />

          <div className="relative z-10 w-full max-h-[80vh] rounded-t-3xl bg-white p-5 shadow-[0_-12px_30px_rgba(15,23,52,0.35)] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#071A34]">
                {t("psychologistsList.filters.title")}
              </h2>
              <button
                type="button"
                onClick={() => setFiltersModalOpen(false)}
                className="text-[20px] leading-none text-[#9BA6B5]"
              >
                ×
              </button>
            </div>

            {renderFiltersContent()}

            <button
              type="button"
              onClick={() => setFiltersModalOpen(false)}
              className="mt-5 w-full rounded-full bg-[#1F98FA] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_12px_24px_rgba(31,152,250,0.5)] hover:bg-[#0f84e2] transition-colors"
            >
              {t("psychologistsList.filters.apply") ?? "Применить"}
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default PsychologistsListPage;