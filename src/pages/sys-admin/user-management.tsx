import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext, useCallback } from "react";

import {
  ControlledBackdrop,
  ControlledTypography,
  UncontrolledCard,
} from "@/components";

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
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
const UserManagement: React.FC<PageProps> = ({data}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if(data?.preloadedAccessLevels == 1){
        setLoading(false)
        checkAuthentication("admin")
      } else {
        router.push('/sys-admin/auth/dashboardauth')
      }
    }, 3000);
  }, [accessSavedAuth, accessUserId]);

  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
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
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const preloadedAccessLevels = await getSecretsIdentifiedAccessLevel(1)
    return { props : { data: { preloadedAccessLevels }}}
  } catch (error) {
    console.log(`Error on get Notification response: ${JSON.stringify(error)} . `)
    return { props : {error}}
  }
}

export default UserManagement;
