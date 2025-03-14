import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { SidebarProvider } from "./context/SidebarContext";

// Lazy load page components for better performance
const InventoryPage = lazy(
  () => import("./components/inventory/InventoryPage"),
);
const PurchasePage = lazy(() => import("./components/purchase/PurchasePage"));
const SalesPage = lazy(() => import("./components/sales/SalesPage"));
const InvoiceBuilderPage = lazy(
  () => import("./components/invoice/InvoiceBuilderPage"),
);

function App() {
  return (
    <SidebarProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchase" element={<PurchasePage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/invoice-builder" element={<InvoiceBuilderPage />} />
            {/* Add the tempobook route to prevent catchall issues */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </SidebarProvider>
  );
}

export default App;
