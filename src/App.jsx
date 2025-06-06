import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SalesForm from "./pages/SalesForm";
// import AdminDashboard from "./pages/AdminDashboard";
import ServicePage from "./pages/ServicePage";
import AccountsPage from "./pages/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={["sales"]}>
                <SalesForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                {/* <AdminDashboard /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-details"
            element={
              <ProtectedRoute allowedRoles={["service"]}>
                <ServicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute allowedRoles={["accounts"]}>
                <AccountsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
