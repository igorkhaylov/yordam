import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { MainLayout } from "../../../components/layout/MainLayout.jsx";
import { useFavorites } from "../../favorites/FavoritesContext.jsx";
import { PsychologistCard } from "../components/PsychologistCard.jsx";
import { getPsychologistsList } from "../../../shared/api/api";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../../shared/ui/EmptyState";

export default function FavoritePsychologistsPage() {
    const { t, i18n } = useTranslation();
    const { favoriteIds } = useFavorites();
    const navigate = useNavigate();

    const [allPsychologists, setAllPsychologists] = useState([]);
    const [loading, setLoading] = useState(favoriteIds.length > 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (favoriteIds.length === 0) {
            setAllPsychologists([]);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const list = await getPsychologistsList();
                if (!cancelled) {
                    setAllPsychologists(list);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error(e);
                    setError(
                        e?.message || t("favoritesPage.error.default")
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
    }, [favoriteIds, t, i18n.language]);

    const favorites = useMemo(
        () =>
            allPsychologists.filter((p) =>
                favoriteIds.includes(String(p.id))
            ),
        [allPsychologists, favoriteIds]
    );

    return (
        <MainLayout>
            <div className="w-full px-4 lg:px-12 xl:px-[72px] py-10">
                {/* Заголовок */}
                <h1 className="font-display text-[32px] md:text-[40px] font-bold text-[#1F98FA]">
                    {t("favoritesPage.title")}
                </h1>

                {/* Хлебные крошки */}
                <div className="mt-4 mb-6 flex items-center gap-1 text-[13px] text-[#9BA6B5]">
                    <Link to="/" className="hover:text-[#1F98FA]">
                        {t("favoritesPage.breadcrumbs.home")}
                    </Link>
                    <span>›</span>
                    <span className="text-[#071A34]">
                        {t("favoritesPage.breadcrumbs.favorites")}
                    </span>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="rounded-[24px] bg-white/90 p-8 text-[14px] text-[#6F7A89] shadow-sm">
                        {t("favoritesPage.loading")}
                    </div>
                )}

                {/* ERROR */}
                {error && !loading && (
                    <div className="rounded-[24px] bg-white/90 p-8 text-[14px] text-red-500 shadow-sm">
                        <span className="font-semibold mr-1">
                            {t("favoritesPage.error.prefix")}
                        </span>
                        <span>{error}</span>
                    </div>
                )}

                {/* ЕЩЁ НЕТ ИЗБРАННЫХ */}
                {!loading && !error && favoriteIds.length === 0 && (
                    <div className="rounded-[24px] bg-white/90 shadow-sm">
                        <EmptyState
                            icon={Heart}
                            title={t("favoritesPage.empty.noFavorites")}
                            description={t("favoritesPage.empty.noFavoritesHint", "Нажмите на сердечко на карточке специалиста, чтобы добавить в избранное")}
                            actionLabel={t("favoritesPage.empty.goToCatalog", "Перейти в каталог")}
                            onAction={() => navigate("/psychologists")}
                        />
                    </div>
                )}

                {/* В ИЗБРАННЫХ ЕСТЬ ID, НО В СПИСКЕ ИХ НЕТ */}
                {!loading &&
                    !error &&
                    favoriteIds.length > 0 &&
                    favorites.length === 0 && (
                        <div className="rounded-[24px] bg-white/90 p-8 text-[14px] text-[#6F7A89] shadow-sm">
                            {t("favoritesPage.empty.missingFromList")}
                        </div>
                    )}

                {/* НОРМАЛЬНЫЙ СПИСОК ИЗБРАННОГО */}
                {!loading && !error && favorites.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 justify-items-center xl:justify-items-start">
                        {favorites.map((p) => (
                            <PsychologistCard key={p.id} psychologist={p} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
