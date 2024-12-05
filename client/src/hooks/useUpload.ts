import { useState } from "react";

interface UseUploadReturn {
  file: File | null;
  preview: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearFile: () => void;
}

const useUpload = (): UseUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Generate a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return {
    file,
    preview,
    handleFileChange,
    clearFile,
  };
};

export default useUpload;
