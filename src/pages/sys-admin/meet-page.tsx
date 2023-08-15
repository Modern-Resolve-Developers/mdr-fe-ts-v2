import { useEffect, useCallback, useRef, useContext, useState } from "react";
import { useMeetContext } from "@/utils/context/base/MeetContext";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Container, Typography } from "@mui/material";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { ControlledBackdrop, UncontrolledCard } from "@/components";
import { useAtom } from "jotai";
import { meetAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { joinMeetAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useToastContext } from "@/utils/context/base/ToastContext";
import { useLoaders } from "@/utils/context/base/LoadingContext";
import { useReferences } from "@/utils/context/hooks/hooks";

declare var JitsiMeetExternalAPI: any;
const MeetPage: React.FC = () => {
  const [joinAtom, setJoinAtom] = useAtom(joinMeetAtom);
  const [meetDetails, setMeetDetails] = useAtom(meetAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const domain = "meet.jit.si";
  let api: any = {};
  const router = useRouter();
  const { name } = useMeetContext();
  const { match } = router.query;
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken, requestGetNums, requestNum, approveIncomingDevice, cookies, devicePromptApproval } = useAuthContext();
    const { setLoading, loading } = useLoaders()
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { handleOnToast } = useToastContext()
  const { getPropsDynamic } = useDynamicDashboardContext();
  const [devicePrompt, setDevicePrompt] = useState<boolean>(false)
  const [references, setReferences] = useReferences()
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage){
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
  useEffect(() => {
    if (!jitsiApiRef.current && containerRef.current) {
      jitsiApiRef.current = new JitsiMeetExternalAPI("meet.jit.si", {
        roomName: match,
        width: "100%",
        height: 800,
        parentNode: containerRef.current,
        configOverwrite: { prejoinPageEnabled: false },
        userInfo: {
          displayName: meetDetails?.username,
        },
      });
      jitsiApiRef.current.addEventListeners({
        readyToClose: handleClose,
        participantLeft: handleParticipantLeft,
        participantJoined: handleParticipantJoined,
        videoConferenceJoined: handleVideoConferenceJoined,
        videoConferenceLeft: handleVideoConferenceLeft,
      });
    }
    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
  }, []);
  const handleClose = () => {
    console.log("hang out");
  };
  const handleParticipantLeft = async (participant: any) => {
    console.log("handleParticipantLeft", participant);
    await getParticipants();
  };
  const handleParticipantJoined = async (participant: any) => {
    console.log("handleParticipantJoined", participant);
    await getParticipants();
  };
  const handleVideoConferenceJoined = async (participant: any) => {
    console.log("handleVideoConferenceJoined", participant);
    await getParticipants();
  };
  const handleVideoConferenceLeft = () => {
    router.push("/sys-admin/digital-meet");
  };
  const getParticipants = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(jitsiApiRef.current.getParticipantsInfo());
      }, 500);
    });
  };
  const handleApproveDeviceIncoming = () => {
    approveIncomingDevice(cookies.deviceId, references?.email)
  }
  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <>
         {
            expirationTime != null && expirationTime <= 30 * 1000 &&
            AlertTracker(
              `You are idle. Token expires in: ${FormatExpiry(expirationTime)}`, "error"
            )
          }
        <div ref={containerRef}></div>
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
        </>
      )}
    </>
  );
};

export default MeetPage;
