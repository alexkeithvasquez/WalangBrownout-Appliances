import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./components/Home";
import PurchasingDashboard from "./components/PurchasingDashboard";
import WarehouseScannerApp from "./components/WarehouseScannerApp";
import OnlineStorefront from "./components/OnlineStorefront";
import ManagementReporting from "./components/ManagementReporting";
import Login from "./components/Login";
import MyOrders from "./components/MyOrders";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
        Module not found
      </h1>
      <p className="mt-2 text-sm text-muted">
        That route isn't wired up to anything.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block text-sm text-online hover:underline"
      >
        Back to the panel
      </Link>
    </main>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg font-body text-ink">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login" replace />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchasing"
            element={
              <ProtectedRoute>
                <PurchasingDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse"
            element={
              <ProtectedRoute>
                <WarehouseScannerApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/storefront"
            element={
              <ProtectedRoute>
                <OnlineStorefront />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reporting"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManagementReporting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["admin", "staff"]}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
