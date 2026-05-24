import { toast, type Id } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "light",
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "light",
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "light",
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: "top-right",
    theme: "light",
  });
};

export const showWarnToast = (message: string) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "light",
  });
};


