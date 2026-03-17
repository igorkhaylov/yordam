import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  UserCircle2,
  Settings,
  CreditCard,
  Video,
  LifeBuoy,
  LogOut,
  Heart,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import logo from "../../assets/images/logo.svg";
import { useAuth } from "../../features/auth/AuthContext";
import { useFavorites } from "../../features/favorites/FavoritesContext";

import i18n from "../../shared/i18n";
import { useTranslation } from "react-i18next";

// флажки
import flagRu from "../../assets/images/ru.png";
import flagUz from "../../assets/images/uz.png";
import flagEn from "../../assets/images/en.png";

function HeaderNavItem({ to, label }) {
  return (
    <NavLink to={to} end={to === "/"}>
      {({ isActive }) => (
        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative inline-flex items-center px-3 py-1 text-[13px] font-medium transition-colors group
          ${
            isActive
              ? "text-[#071A34]"
              : "text-[#6D7685] hover:text-[#071A34]"
          }`}
        >
          <span>{label}</span>
          <span
            className={`
              pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#1F98FA]
              origin-left transition-transform duration-500 ease-in-out
              ${
                isActive
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
              }
            `}
          />
        </motion.div>
      )}
    </NavLink>
  );
}

function resolvePictureUrl(picture) {
  if (!picture) return "";

  if (typeof picture === "string") {
    return picture;
  }

  if (typeof picture === "object") {
    return (
      picture.large ||
      picture.medium ||
      picture.original ||
      picture.small ||
      picture.thumbnail ||
      ""
    );
  }

  return "";
}

function getDisplayName(user) {
  return (
    user?.profile?.name ||
    user?.profile?.full_name ||
    user?.fullName ||
    user?.name ||
    user?.email ||
    "Пользователь"
  );
}

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { t } = useTranslation();

  const hasFavorites = favoriteIds.length > 0;

  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const accountDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target)
      ) {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/psychologists", label: t("header.nav.catalog") },
    { to: "/companies", label: t("header.nav.companies") },
    { to: "/psy", label: t("header.nav.psychologists") },
    { to: "/influencers", label: t("header.nav.influencers") },
    { to: "/contacts", label: t("header.nav.contacts") },
  ];

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const displayName = getDisplayName(user);
  const initials = displayName?.trim()?.[0]?.toUpperCase() || "Ю";
  const avatarUrl = resolvePictureUrl(
    user?.profile?.picture || user?.picture || user?.profile?.avatar
  );

  const getBaseLang = (lng) => {
    if (!lng) return "ru";
    if (lng.startsWith("uz")) return "uz";
    if (lng.startsWith("en")) return "en";
    if (lng.startsWith("ru")) return "ru";
    return "ru";
  };

  const currentLang = getBaseLang(i18n.language);

  const languages = [
    { code: "ru", label: "RU", icon: flagRu },
    { code: "uz", label: "UZ", icon: flagUz },
    { code: "en", label: "EN", icon: flagEn },
  ];

  const currentLangObj =
    languages.find((lng) => lng.code === currentLang) || languages[0];

  const changeLanguage = (code) => {
    if (code === currentLang) {
      setLangMenuOpen(false);
      return;
    }
    i18n.changeLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-[1920px] flex-col px-4 py-3 lg:px-[72px] lg:py-[22px]">
        <div className="flex w-full items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Yordam"
              className="h-[32px] w-auto object-contain"
            />
          </Link>

          <nav className="ml-6 flex flex-1 items-center justify-end gap-6">
            <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }} className="hidden items-center gap-6 text-[13px] text-[#6D7685] lg:flex">
              {navLinks.map((link) => (
                <HeaderNavItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                />
              ))}

              <div ref={langDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-[#D0D9E5] bg-[#F5F7FB] px-2.5 py-1.5 text-[13px] text-[#071A34] hover:border-[#1F98FA] hover:bg-[#EDF5FF] transition-colors"
                >
                  <img
                    src={currentLangObj.icon}
                    alt={currentLangObj.label}
                    className="h-4 w-6 rounded object-cover"
                  />
                  <span className="font-semibold">{currentLangObj.label}</span>
                  {langMenuOpen ? (
                    <ChevronUp className="h-3 w-3 text-[#9BA6B5]" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-[#9BA6B5]" />
                  )}
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 top-[120%] z-40 w-[150px] rounded-2xl border border-[#E1E8F0] bg-white py-2 shadow-[0_12px_30px_rgba(15,35,52,0.16)]">
                    {languages.map((lang) => {
                      const active = lang.code === currentLang;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => changeLanguage(lang.code)}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] ${
                            active
                              ? "bg-[#F0F7FF] text-[#1F98FA] font-semibold"
                              : "text-[#071A34] hover:bg-[#F7FAFF]"
                          }`}
                        >
                          <img
                            src={lang.icon}
                            alt={lang.label}
                            className="h-4 w-6 rounded object-cover"
                          />
                          <span>{lang.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {user && (
                <Link
                  to="/favorites"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1F98FA] hover:bg-[#E8F4FF]"
                  title={t("header.favorites.title")}
                >
                  <Heart
                    className={`h-4 w-4 ${hasFavorites ? "fill-[#1F98FA]" : ""}`}
                  />
                  {hasFavorites && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4D3D] text-[10px] text-white">
                      {favoriteIds.length}
                    </span>
                  )}
                </Link>
              )}
            </motion.div>

            <div className="hidden items-center lg:flex">
              {!user ? (
                <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }} className="ml-auto flex items-center gap-3 text-[13px]">
                  <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <Link
                      to="/auth/login"
                      className="inline-flex items-center justify-center rounded-full border border-[#C7D2E2] px-4 py-2 text-[#071A34] hover:border-[#1F98FA]"
                    >
                      {t("header.auth.login")}
                    </Link>
                  </motion.div>
                  <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <Link
                      to="/auth/register"
                      className="inline-flex items-center justify-center rounded-full border border-[#1F98FA] bg-[#1F98FA] px-5 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(31,152,250,0.55)] hover:bg-[#0f84e2]"
                    >
                      {t("header.auth.register")}
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                <div
                  ref={accountDropdownRef}
                  className="relative ml-auto flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-3 rounded-full border border-[#C7D2E2] bg-white px-2.5 py-1.5 hover:border-[#1F98FA] transition-colors"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1F98FA] text-[14px] font-semibold text-white">
                        {initials}
                      </div>
                    )}

                    <div className="hidden flex-col items-start leading-tight sm:flex">
                      <span className="text-[13px] font-semibold text-[#071A34]">
                        {displayName}
                      </span>
                      <span className="text-[11px] text-[#9BA6B5]">
                        {user.role === "psychologist"
                          ? t("header.role.psychologist")
                          : t("header.role.client")}
                      </span>
                    </div>

                    {menuOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#9BA6B5]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#9BA6B5]" />
                    )}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-[110%] z-30 w-[260px] rounded-2xl border border-[#E1E8F0] bg-white p-3 shadow-[0_18px_42px_rgba(67,142,229,0.25)]">
                      <div className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9BA6B5]">
                        {t("header.account.title")}
                      </div>

                      <div className="space-y-1 text-[14px] text-[#071A34]">
                        <Link
                          to="/client"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <MessageCircle className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.personalQuestions")}</span>
                        </Link>

                        <Link
                          to="/psychologists"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <UserCircle2 className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.choosePsychologist")}</span>
                        </Link>

                        <Link
                          to="/client/settings"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <Settings className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.settings")}</span>
                        </Link>

                        <Link
                          to="/client/billing"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <CreditCard className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.billing")}</span>
                        </Link>

                        <Link
                          to="/client/videochat"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <Video className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.videochat")}</span>
                        </Link>

                        <Link
                          to="/client/support"
                          onClick={() => setMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F5F8FF]"
                        >
                          <LifeBuoy className="h-4 w-4 text-[#1F98FA]" />
                          <span>{t("header.account.support")}</span>
                        </Link>

                        <div className="my-1 border-t border-[#E7EDF5]" />

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[#FF4D3D] hover:bg-[#FFF4F2]"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t("header.account.logout")}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D9E5] bg-white text-[#071A34] hover:border-[#1F98FA] lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <div className="flex flex-col items-center justify-center">
                <span
                  className={`block h-[2px] w-5 rounded-full bg-[#071A34] transition-transform duration-300 ${
                    mobileOpen ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`mt-[3px] block h-[2px] w-5 rounded-full bg-[#071A34] transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`mt-[3px] block h-[2px] w-5 rounded-full bg-[#071A34] transition-transform duration-300 ${
                    mobileOpen ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </nav>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mt-3 w-full overflow-hidden rounded-2xl border border-[#E1E8F0] bg-white p-3 text-[14px] text-[#071A34] shadow-[0_18px_42px_rgba(67,142,229,0.15)] lg:hidden"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-xl px-3 py-2 ${
                      isActive(link.to)
                        ? "bg-[#F0F7FF] text-[#1F98FA] font-semibold"
                        : "hover:bg-[#F7FAFF]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="mt-2 flex gap-2">
                  {languages.map((lang) => {
                    const active = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-full border px-2 py-1 text-[13px] ${
                          active
                            ? "border-[#1F98FA] bg-[#F0F7FF] text-[#1F98FA] font-semibold"
                            : "border-[#D0D9E5] text-[#071A34]"
                        }`}
                      >
                        <img
                          src={lang.icon}
                          alt={lang.label}
                          className="h-4 w-6 rounded object-cover"
                        />
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 border-t border-[#E7EDF5] pt-3 flex flex-col gap-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2 px-1 text-[13px] text-[#6F7A89]">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1F98FA] text-[13px] font-semibold text-white">
                            {initials}
                          </div>
                        )}

                        <div className="flex flex-col leading-tight">
                          <span className="text-[#071A34] font-semibold">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-[#9BA6B5]">
                            {user.role === "psychologist"
                              ? t("header.role.psychologist")
                              : t("header.role.client")}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[#F7FAFF]"
                      >
                        <Heart
                          className={`h-4 w-4 text-[#1F98FA] ${
                            hasFavorites ? "fill-[#1F98FA]" : ""
                          }`}
                        />
                        <span>{t("header.favorites.title")}</span>
                        {hasFavorites && (
                          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF4D3D] text-[10px] text-white">
                            {favoriteIds.length}
                          </span>
                        )}
                      </Link>

                      <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[#FF4D3D] hover:bg-[#FFF4F2]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("header.account.logout")}</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/auth/login"
                        className="rounded-full border border-[#C7D2E2] px-4 py-2 text-center text-[13px] text-[#071A34] hover:border-[#1F98FA]"
                      >
                        {t("header.auth.login")}
                      </Link>
                      <Link
                        to="/auth/register"
                        className="rounded-full border border-[#1F98FA] bg-[#1F98FA] px-4 py-2 text-center text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(31,152,250,0.55)] hover:bg-[#0f84e2]"
                      >
                        {t("header.auth.register")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Header;