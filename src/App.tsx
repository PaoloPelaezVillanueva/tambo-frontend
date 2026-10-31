
import { ToastContainer } from "react-toastify";
import PosPage from "./pages/PosPage";
import LoginPage from "./pages/Login";
import { useAuth } from "./auth/AuthContext";
import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  const { user, loading } = useAuth();

  if(loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to={"/pos"} replace />
              : <LoginPage />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/pos" element={<PosPage />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={user ? "/pos" : "/login"}
              replace
            />
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="light"
      />
    </>
  );
}

export default App;