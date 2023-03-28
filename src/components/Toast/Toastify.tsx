import { ToastProps } from ".";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ControlledToast: React.FC<ToastProps> = ({
    position,
    autoClose,
    hideProgressBar,
    newestOnTop,
    closeOnClick,
    rtl,
    pauseOnFocusLoss,
    draggable,
    pauseOnHover,
    theme
}) => {
    return(
        <ToastContainer 
        position={position}
        autoClose={autoClose}
        hideProgressBar={hideProgressBar}
        newestOnTop={newestOnTop}
        closeOnClick={closeOnClick}
        rtl={rtl}
        pauseOnFocusLoss={pauseOnFocusLoss}
        draggable={draggable}
        pauseOnHover={pauseOnHover}
        theme={theme}
        />
    )
}

export default ControlledToast