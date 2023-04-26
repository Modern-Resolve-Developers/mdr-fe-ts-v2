import DashboardLayout from "@/components/DashboardLayout";
import { ControlledTypography, UncontrolledCard } from "@/components";
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
const Task: React.FC = () => {
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { getPropsDynamic } = useDynamicDashboardContext();
  const { checkAuthentication } = useAuthContext();
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
              isGutterBottom
              text="Task Management > Create Task"
            />
            <TaskFormAdditionalDetails />
          </UncontrolledCard>
        </Container>
      </DashboardLayout>
    </>
  );
};

export default Task;
