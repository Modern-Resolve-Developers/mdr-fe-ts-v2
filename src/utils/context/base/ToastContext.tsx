import { createContext, useContext } from "react";
import { ToastContextSetup } from "..";

import { toast } from "react-toastify";

export const ToastContextContinue = createContext<ToastContextSetup>(undefined as any);

type ToastContextProps = {
  children: React.ReactNode;
};

const ToastContext: React.FC<ToastContextProps> = ({ children }) => {
  const handleOnToast = (
    message: string,
    position: any,
    hideProgressBar: boolean,
    closeOnClick?: boolean,
    pauseOnHover?: boolean,
    draggable?: boolean,
    progress?: any,
    theme?: any,
    type?: any
  ) => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: position,
          autoClose: 5000,
          hideProgressBar: hideProgressBar,
          closeOnClick: closeOnClick,
          pauseOnHover: pauseOnHover,
          draggable: draggable,
          progress: progress,
          theme: theme,
        });
        break;
      case "error":
        toast.error(message, {
          position: position,
          autoClose: 5000,
          hideProgressBar: hideProgressBar,
          closeOnClick: closeOnClick,
          pauseOnHover: pauseOnHover,
          draggable: draggable,
          progress: progress,
          theme: theme,
        });
        break;
      case "warning":
        toast.error(message, {
          position: position,
          autoClose: 5000,
          hideProgressBar: hideProgressBar,
          closeOnClick: closeOnClick,
          pauseOnHover: pauseOnHover,
          draggable: draggable,
          progress: progress,
          theme: theme,
        });
        break;
      default:
        break;
    }
  };
  return (
    <ToastContextContinue.Provider
      value={{
        handleOnToast,
      }}
    >
      {children}
    </ToastContextContinue.Provider>
  );
};

export default ToastContext;

export const useToastContext = () => {
  if (!ToastContextContinue) {
    throw new Error("toast context must be used");
  }
  return useContext(ToastContextContinue);
};
