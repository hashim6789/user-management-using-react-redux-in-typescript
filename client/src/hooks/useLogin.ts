import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";
import { AppDispatch } from "../store/store";

interface LoginCredentials {
  email: string;
  password: string;
}

const useLogin = () => {
  const dispatch: AppDispatch = useDispatch();

  const login = async (credentials: LoginCredentials) => {
    try {
      const userData = await dispatch(loginUser(credentials)).unwrap();
      if (userData.token) {
        console.log("user token", userData.user);
        localStorage.setItem("currentUser", JSON.stringify(userData.user));
        localStorage.setItem("authToken", userData.token);
      }
    } catch (error: any) {
      return null;
    }
  };

  return { login };
};

export default useLogin;
