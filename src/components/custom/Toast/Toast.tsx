import { toast, Flip, ToastOptions } from "react-toastify";
import "./Toast.scss";

const options: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Flip,
};

const toaster = {
  success: (msg: string) => {
    toast.success(msg);
  },
  error: (msg: string) => {
    console.log("msg", msg);
    toast.error(msg, options);
  },
  warning: (msg: string) => {
    toast.warning(msg, options);
  },
  info: (msg: string, time = 2) => {
    toast.info(msg, {
      position: "top-right",
      autoClose: time * 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Flip,
    });
  },
};

export default toaster;
