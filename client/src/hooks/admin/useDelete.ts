import { useState } from "react";
import axios from "axios";

interface UseDeleteReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  deleteUser: (userId: string) => Promise<void>;
}

const useDelete = (): UseDeleteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = async (userId: string): Promise<void> => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await axios.delete(`http://localhost:3000/api/user/${userId}`);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    deleteUser,
  };
};

export default useDelete;
