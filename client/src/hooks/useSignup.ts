import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useState } from "react";
import { signupUser } from "../store/authSlice";

interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
}

const useSignup = () => {
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const signup = async (credential: SignUpCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(signupUser(credential)).unwrap();
    } catch (error: any) {
      setError(error.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return { signup, error, loading };
};

export default useSignup;
