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
const Task: React.FC = () => {
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const [loading, setLoading] = useState(true);
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
    setTimeout(() => {
      setLoading(false);
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

export default Task;
