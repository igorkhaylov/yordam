import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./features/auth/AuthContext";
import { RequireAuth } from "./features/auth/RequireAuth";
import { FavoritesProvider } from "./features/favorites/FavoritesContext";
import { ErrorBoundary } from "./shared/ui/ErrorBoundary";

// Spinner for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1F98FA] border-t-transparent" />
    </div>
  );
}

// Общие страницы
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const InfluencersPage = lazy(() => import("./pages/InfluencersPage"));
const CompaniesPage = lazy(() => import("./pages/CompaniesPage"));
const ForPsychologistsPage = lazy(() =>
  import("./pages/ForPsychologistsPage"),
);
const ContactsPage = lazy(() => import("./pages/ContactsPage"));

// Auth
const LoginPage = lazy(() =>
  import("./features/auth/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const RegisterConfirmPage = lazy(() =>
  import("./features/auth/RegisterConfirmPage"),
);

// Психологи
const PsychologistsListPage = lazy(() =>
  import("./features/psychologists/pages/PsychologistsListPage"),
);
const PsychologistDetailPage = lazy(() =>
  import("./features/psychologists/pages/PsychologistDetailPage"),
);
const FavoritePsychologistsPage = lazy(() =>
  import("./features/psychologists/pages/FavoritePsychologistsPage"),
);

// Кабинет клиента
const ClientLayout = lazy(() => import("./features/profile/ClientLayout"));
const ClientProfilePage = lazy(() =>
  import("./features/profile/ClientProfilePage"),
);
const ClientPsychologistsPage = lazy(() =>
  import("./features/profile/ClientPsychologistsPage"),
);
const ClientSettingsPage = lazy(() =>
  import("./features/profile/ClientSettingsPage"),
);
const ClientBillingPage = lazy(() =>
  import("./features/profile/ClientBillingPage"),
);
const ClientVideoChatPage = lazy(() =>
  import("./features/profile/ClientVideoChatPage"),
);
const ClientSupportPage = lazy(() =>
  import("./features/profile/ClientSupportPage"),
);

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/psychologists"
                  element={<PsychologistsListPage />}
                />
                <Route path="/influencers" element={<InfluencersPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/psy" element={<ForPsychologistsPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route
                  path="/psychologists/:id"
                  element={<PsychologistDetailPage />}
                />

                <Route
                  path="/favorites"
                  element={
                    <RequireAuth>
                      <FavoritePsychologistsPage />
                    </RequireAuth>
                  }
                />

                <Route path="/auth/login" element={<LoginPage />} />
                <Route
                  path="/auth/register/confirm"
                  element={<RegisterConfirmPage />}
                />
                <Route path="/auth/register" element={<RegisterPage />} />

                <Route
                  path="/client"
                  element={
                    <RequireAuth role="client">
                      <ClientLayout />
                    </RequireAuth>
                  }
                >
                  <Route index element={<ClientProfilePage />} />
                  <Route
                    path="psychologists"
                    element={<ClientPsychologistsPage />}
                  />
                  <Route path="settings" element={<ClientSettingsPage />} />
                  <Route path="billing" element={<ClientBillingPage />} />
                  <Route path="videochat" element={<ClientVideoChatPage />} />
                  <Route path="support" element={<ClientSupportPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}
