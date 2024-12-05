import SignInPage from "./pages/SignInPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import UserDashboard from "./pages/UserDashBoard";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AuthenticatedAdminRoute from "./components/AuthenticatedAdminRoute";
import NotAuthenticatedAdminRoute from "./components/NotAuthenticatedAdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignInPage />}>
          <Route
            path="/login"
            element={
              <NotAuthenticatedRoute>
                <Login />
              </NotAuthenticatedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <NotAuthenticatedRoute>
                <SignUp />
              </NotAuthenticatedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedRoute>
                <UserDashboard />
              </AuthenticatedRoute>
            }
          />
        </Route>
        <Route path="/admin" element={<AdminPage />}>
          <Route
            path="login"
            element={
              <NotAuthenticatedAdminRoute>
                <AdminLogin />
              </NotAuthenticatedAdminRoute>
            }
          ></Route>
          <Route
            path="dashboard"
            element={
              <AuthenticatedAdminRoute>
                <AdminDashboard />
              </AuthenticatedAdminRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
