// useConfirmationDialog.ts
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Custom hook for SweetAlert2 confirmation dialog
export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const confirm = async (message: string, title: string = "Are you sure?") => {
    setIsOpen(true);

    const result = await MySwal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    setIsOpen(false);

    return result.isConfirmed; // Return whether the user confirmed the action
  };

  return {
    confirm,
    isOpen,
  };
};
