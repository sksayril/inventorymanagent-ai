import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SubscriptionGuard from "./components/auth/SubscriptionGuard";

// Lazy load page components for better performance
const InventoryPage = lazy(
  () => import("./components/inventory/InventoryPage"),
);
const PurchasePage = lazy(() => import("./components/purchase/PurchasePage"));
const SalesPage = lazy(() => import("./components/sales/SalesPage"));
const InvoiceBuilderPage = lazy(
  () => import("./components/invoice/InvoiceBuilderPage"),
);
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              Loading...
            </div>
          }
        >
          {/* Tempo routes for development */}
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              {/* Subscription page - accessible after login but before subscription */}
              <Route path="/subscription" element={<SubscriptionPage />} />

              {/* Routes that require subscription */}
              <Route element={<SubscriptionGuard />}>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route
                  path="/invoice-builder"
                  element={<InvoiceBuilderPage />}
                />
              </Route>
            </Route>

            {/* Redirect to login if no route matches */}
            <Route path="*" element={<Navigate to="/login" />} />

            {/* Add the tempobook route to prevent catchall issues */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" element={<div />} />
            )}
          </Routes>
        </Suspense>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
