import {
  ControlledBackdrop,
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
import { useContext, useEffect, useState } from "react";
import { DashboardSettings } from "@/components/settings/settingsForms/DashboardSettingsForm";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouter } from "next/router";

const SettingsManagement: React.FC<PageProps> = ({data}) => {
  const { checkAuthentication } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  useEffect(() => {
    setTimeout(() => {
      if(data?.preloadedAccessLevels == 1) {
        setLoading(false)
        checkAuthentication("admin");
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

export default SettingsManagement;
