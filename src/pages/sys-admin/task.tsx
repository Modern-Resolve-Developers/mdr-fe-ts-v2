import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledBackdrop,
  ControlledTypography,
  UncontrolledCard,
} from "@/components";
import { Container, ListItemIcon, Typography } from "@mui/material";
import { TaskFormAdditionalDetails } from "@/components/TaskManagement";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { useContext, useEffect, useState } from "react";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouter } from "next/router";
import { useToastContext } from "@/utils/context/base/ToastContext";
import { useLoaders } from "@/utils/context/base/LoadingContext";
import { useReferences } from "@/utils/context/hooks/hooks";
const Task: React.FC<PageProps> = ({data}) => {
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { handleOnToast } = useToastContext()
  const { getPropsDynamic } = useDynamicDashboardContext();
  const { signoutProcess, tokenExpired, disableRefreshTokenCalled, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken, devicePromptApproval, requestGetNums,
   requestNum, approveIncomingDevice, cookies } = useAuthContext();
   const { setLoading, loading } = useLoaders()
   const [references, setReferences] = useReferences()
   const [devicePrompt, setDevicePrompt] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(requestGetNums, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if(requestNum == 1 || requestNum == 2) {
      setDevicePrompt(true)
    }
  }, [requestNum])
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
          signoutProcess("expired")
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
  const handleApproveDeviceIncoming = () => {
    approveIncomingDevice(cookies.deviceId, references?.email)
  }
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
          {
            devicePromptApproval({
              content: (
                <>
                 <Typography gutterBottom variant="button">New Device Approval</Typography>
                 <Container>
                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  >
                    <img 
                    src='https://cdn.dribbble.com/userupload/7433107/file/original-dd35f5eb54ba85db5dedda17c84e0353.png?resize=1200x900'
                    style={{
                      width: '50%',
                  }}
                    />
                  </div>
                  <Typography variant="caption">
                    A new device is trying to sign in. Please select between approve and decline. Once approved you will automatically logged out on this device
                  </Typography>
                 </Container>
                </>
              ),
              handleAuthApproved: handleApproveDeviceIncoming,
              handleAuthDeclined: () => {},
              openState: devicePrompt
            })
          }
        </Container>
      )}
    </>
  );
};

export default Task;
