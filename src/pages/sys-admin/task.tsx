import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledBackdrop,
  ControlledTypography,
  UncontrolledCard,
} from "@/components";
import { Container, ListItemIcon } from "@mui/material";
import { TaskFormAdditionalDetails } from "@/components/TaskManagement";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { useContext, useEffect, useState } from "react";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouter } from "next/router";
const Task: React.FC<PageProps> = ({data}) => {
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { getPropsDynamic } = useDynamicDashboardContext();
  const { checkAuthentication } = useAuthContext();
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
        checkAuthentication("admin");
      } else {
        router.push('/sys-admin/auth/dashboardauth')
      }
    }, 3000);
  }, []);
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          <UncontrolledCard>
            <ControlledTypography
              variant="h6"
              isGutterBottom
              text="Task Management > Create Task"
            />
            <TaskFormAdditionalDetails />
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

export default Task;
