import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext, useCallback } from "react";

import { ControlledTypography, UncontrolledCard } from "@/components";

import { useRouter } from "next/router";
import { Container } from "@mui/material";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { ContextSetup } from "@/utils/context";
import { ARContext } from "@/utils/context/base/AdminRegistrationContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { FormAdditionalDetails } from "@/components/UserManagement";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
const UserManagement: React.FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [savedAuth, setSavedAuth] = useState({});
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { CheckAuthentication } = useContext(ARContext) as ContextSetup;
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { checkAuthentication } = useAuthContext();
  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
      setIdentifiedUser(repo?.data);
    });
  }, []);
  useEffect(() => {
    checkAuthentication("admin");
  }, [accessSavedAuth, accessUserId]);

  return (
    <>
      <DashboardLayout
        sidebarConfig={
          idetifiedUser == "Administrator"
            ? sidebarList
            : idetifiedUser == "Developers"
            ? []
            : []
        }
        subsidebarConfig={
          idetifiedUser == "Administrator"
            ? sidebarExpand
            : idetifiedUser == "Developers"
            ? []
            : []
        }
      >
        <Container>
          <UncontrolledCard>
            <ControlledTypography
              variant="h6"
              isGutterBottom={true}
              text="User Management"
            />
            <FormAdditionalDetails />
          </UncontrolledCard>
        </Container>
      </DashboardLayout>
    </>
  );
};

export default UserManagement;
