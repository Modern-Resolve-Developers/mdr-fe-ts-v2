import { SignUpAdditionalForm } from "@/components/client";
import { useEffect, useState } from "react";
const ClientAccountRegistration: React.FC = () => {
  const [screenSizeCondition, setScreenSizeCondition] = useState(false);
  useEffect(() => {
    function handleResize() {
      setScreenSizeCondition(window.innerWidth <= 1538);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className={`cl-account-creation ${
        screenSizeCondition ? "cl-account-creation-adjust-height" : ""
      }`}
    >
      <SignUpAdditionalForm />
    </div>
  );
};

export default ClientAccountRegistration;
