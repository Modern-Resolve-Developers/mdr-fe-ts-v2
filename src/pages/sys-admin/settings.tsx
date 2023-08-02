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
import { useToastContext } from "@/utils/context/base/ToastContext";

const SettingsManagement: React.FC = () => {
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const { handleOnToast } = useToastContext()
  const router = useRouter()
  useEffect(() => {
    if(!accessToken || accessToken == undefined) {
      router.push('/login')
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } else {
      setLoading(false)
      const isExpired = TrackTokenMovement()
      if(isExpired) {
        signoutProcess()
        handleOnToast(
          "Token expired. Please re-login.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      }
    }
  }, [tokenExpired]);
  useEffect(() => {
    if(!disableRefreshTokenCalled) {
      if(isMouseMoved) {
        refreshTokenBeingCalled()
      }
    }
  }, [isMouseMoved, disableRefreshTokenCalled])
  useEffect(() => {
    if(!disableRefreshTokenCalled) {
      if(isKeyPressed){
        refreshTokenBeingCalled()
      }
    }
  }, [isKeyPressed, disableRefreshTokenCalled])
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          {
            expirationTime != null && expirationTime <= 30 * 1000 &&
            AlertTracker(
              `You are idle. Token expires in: ${FormatExpiry(expirationTime)}`, "error"
            )
          }
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

export default SettingsManagement;
