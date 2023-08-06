import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledBackdrop,
  ControlledTypography,
  UncontrolledCard,
} from "@/components";
import { Container, ListItemIcon } from "@mui/material";
import { TaskFormAdditionalDetails } from "@/components/TaskManagement";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouter } from "next/router";
import { useToastContext } from "@/utils/context/base/ToastContext";
const Task: React.FC<PageProps> = ({data}) => {
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const { handleOnToast } = useToastContext()
  const { getPropsDynamic } = useDynamicDashboardContext();
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
  const router = useRouter()
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
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
