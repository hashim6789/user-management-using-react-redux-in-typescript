import { useState } from "react";
import axios from "axios";

interface UseEditReturn {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  editUser: (userId: string, updatedData: Record<string, any>) => Promise<void>;
}

const useEdit = (): UseEditReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editUser = async (
    userId: string,
    updatedData: Record<string, any>
  ): Promise<void> => {
    setIsLoading(true);
    setIsSuccess(false);
    setError(null);

    try {
      await axios.put(`http://localhost:3000/api/user/${userId}`, updatedData);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to edit user");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    editUser,
  };
};

export default useEdit;
