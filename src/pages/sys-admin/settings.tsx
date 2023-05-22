import {
  ControlledGrid,
  ControlledTypography,
  UncontrolledCard,
} from "@/components";
import DashboardLayout from "@/components/DashboardLayout";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { sidebarExpand, sidebarList } from "@/utils/sys-routing/sys-routing";
import { Container, Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { DashboardSettings } from "@/components/settings/settingsForms/DashboardSettingsForm";

const SettingsManagement: React.FC = () => {
  const { checkAuthentication } = useAuthContext();
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  useEffect(() => {
    checkAuthentication("admin");
  }, [accessSavedAuth, accessUserId]);
  return (
    <>
      <DashboardLayout
        sidebarConfig={sidebarList}
        subsidebarConfig={sidebarExpand}
      >
        <Container>
          <UncontrolledCard>
            <ControlledTypography
              variant="h6"
              isGutterBottom
              text="Settings Management"
            />
            <ControlledGrid>
              <Grid item xs={6}>
                <DashboardSettings />
              </Grid>
              <Grid item xs={6}></Grid>
            </ControlledGrid>
          </UncontrolledCard>
        </Container>
      </DashboardLayout>
    </>
  );
};

export default SettingsManagement;
