import { useDispatch } from "react-redux";
import { loginAdmin } from "../store/authSlice"; // Replace with your actual admin login slice
import { AppDispatch } from "../store/store";

interface AdminLoginCredentials {
  email: string;
  password: string;
}

const useAdminLogin = () => {
  const dispatch: AppDispatch = useDispatch();

  const adminLogin = async (credentials: AdminLoginCredentials) => {
    try {
      const adminData = await dispatch(loginAdmin(credentials)).unwrap();
      if (adminData.token) {
        console.log("admin token", adminData.admin);
        localStorage.setItem("currentAdmin", JSON.stringify(adminData.admin));
        localStorage.setItem("adminAuthToken", adminData.token);
      }
    } catch (error: any) {
      return null;
    }
  };

  return { adminLogin };
};

export default useAdminLogin;
