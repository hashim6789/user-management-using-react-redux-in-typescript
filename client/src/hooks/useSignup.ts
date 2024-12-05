import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { signupUser } from "../store/authSlice";

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

const useSignup = () => {
  const dispatch: AppDispatch = useDispatch();

  const signup = async (credentials: SignUpCredentials) => {
    try {
      const userData = await dispatch(signupUser(credentials)).unwrap();

      if (userData.token) {
        localStorage.setItem("authToken", userData.token);
        localStorage.setItem("currentUser", JSON.stringify(userData.user));
        return userData;
      }
    } catch (error: any) {
      return null;
    }
  };

  return { signup };
};

export default useSignup;
