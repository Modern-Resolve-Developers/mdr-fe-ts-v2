import { useEffect, useCallback, useRef, useContext, useState } from "react";
import { useMeetContext } from "@/utils/context/base/MeetContext";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Container } from "@mui/material";
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

declare var JitsiMeetExternalAPI: any;
const MeetPage: React.FC = () => {
  const [joinAtom, setJoinAtom] = useAtom(joinMeetAtom);
  const [meetDetails, setMeetDetails] = useAtom(meetAtom);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const domain = "meet.jit.si";
  let api: any = {};
  const router = useRouter();
  const { name } = useMeetContext();
  const { match } = router.query;
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { handleOnToast } = useToastContext()
  const { getPropsDynamic } = useDynamicDashboardContext();

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
        </>
      )}
    </>
  );
};

export default MeetPage;
