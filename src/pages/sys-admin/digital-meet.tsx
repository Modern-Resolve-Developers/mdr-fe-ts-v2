import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledBackdrop,
  ControlledChip,
  ControlledTypography,
  ProjectTable,
  UncontrolledCard,
} from "@/components";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { Container, Grid } from "@mui/material";
import { StartupPage } from "@/components/Jitsi/StartupPage";
import { ControlledPopoverButton } from "@/components/Button/PopoverButton";
import { ControlledTabs } from "@/components/Tabs/Tabs";
import { useContext, useEffect, useState } from "react";
import { useMeetContext } from "@/utils/context/base/MeetContext";
import { NormalButton } from "@/components/Button/NormalButton";
import { useRouter } from "next/router";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup, ToastContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ControlledModal } from "@/components";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledGrid } from "@/components";
import { joinMeetAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";

import { meetAtom } from "@/utils/hooks/useAccountAdditionValues";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";


const baseJoinFormSchema = z.object({
  name: requiredString("Your name is required"),
  password: z.string().optional(),
});

export type JoinMeetingFormAccount = z.infer<typeof baseJoinFormSchema>;
type JoinFormProps = {
  isprivate: boolean;
};
const JoinForm = (props: JoinFormProps) => {
  const { control } = useFormContext<JoinMeetingFormAccount>();
  const { isprivate } = props;
  return (
    <>
      <ControlledGrid>
        {isprivate ? (
          <>
            <Grid item xs={6}>
              <ControlledTextField
                control={control}
                required
                name="name"
                label="Enter name"
                shouldUnregister
              />
            </Grid>
            <Grid item xs={6}>
              <ControlledTextField
                control={control}
                required
                name="password"
                label="Enter room password"
                shouldUnregister
              />
            </Grid>
          </>
        ) : (
          <>
            <ControlledTextField
              control={control}
              required
              name="name"
              label="Enter name"
              shouldUnregister
            />
          </>
        )}
      </ControlledGrid>
    </>
  );
};

const DigitalMeet: React.FC<PageProps> = ({data}) => {
  const [joinAtom, setJoinAtom] = useAtom(joinMeetAtom);
  const [meetDetails, setMeetDetails] = useAtom(meetAtom);
  const form = useForm<JoinMeetingFormAccount>({
    resolver: zodResolver(baseJoinFormSchema),
    mode: "all",
    defaultValues: joinAtom,
  });
  const {
    handleSubmit,
    formState: { isValid },
  } = form;
  const [valueChange, setValueChange] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState(0);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [meetId, setMeetId] = useState<number>(0);
  const handleShowPopOver = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: any
  ) => {
    setMeetId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };
  const popoverOpen = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueChange(newValue);
  };
  const jitsiJoinMeeting = useApiCallBack(
    async (api, args: { roomId: number; name: string }) =>
      await api.mdr.JoinRoomStoreDetails(args)
  );
  const deleteroom = useApiCallBack(
    async (api, id: number) => await api.mdr.DeleteRoom(id)
  );
  const { checkAuthentication } = useAuthContext();
  const router = useRouter();
  const { getAllRooms, rooms, setRooms } = useMeetContext();
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  useEffect(() => {
    getAllRooms();
  }, []);
  const columns: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "roomName",
      headerName: "Room name",
      width: 160,
      sortable: false,
    },
    {
      field: "roomStatus",
      headerName: "Room Status",
      sortable: false,
      width: 300,
      renderCell: (params: any) => {
        if (params.row.roomStatus == "1") {
          return (
            <ControlledChip label="Ongoing" color="success" size={"small"} />
          );
        } else if (params.row.roomStatus == "2") {
          return (
            <ControlledChip label="Call Ended" color="error" size={"small"} />
          );
        } else {
          return (
            <ControlledChip label="Room Lock" color="error" size={"small"} />
          );
        }
      },
    },
    {
      field: "isPrivate",
      headerName: "Room Type",
      sortable: false,
      width: 300,
      renderCell: (params: any) => {
        if (params.row.isPrivate == "0") {
          return (
            <ControlledChip label="Public" color="success" size={"small"} />
          );
        } else {
          return (
            <ControlledChip label="Private" color="success" size={"small"} />
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 160,
      renderCell: (params: any) => {
        return (
          <ControlledPopoverButton
            open={popoverOpen}
            anchorEl={anchorEl}
            handleShowPopOver={(e) => handleShowPopOver(e, params.row.id)}
            handleClosePopOver={handleClosePopOver}
            id={id}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div style={{ 
              padding: "5.48px 23.34px",
              display: "flex",
              flexDirection: 'column'
            }}>
              <NormalButton
                variant="text"
                onClick={() =>
                  joinJitsi(
                    params.row.roomStatus,
                    params.row.roomUrl,
                    params.row.isPrivate,
                    params.row.id
                  )
                }
                size="small"
                children="JOIN"
                disabled={params.row.roomStatus != "1"}
                style={{
                  color: "#505050"
                }}
              />
              <NormalButton
                onClick={() => handleDeleteRoom(params.row.id)}
                variant="text"
                children="DELETE"
                style={{
                  color: "#505050"
                }}
              />
            </div>
          </ControlledPopoverButton>
        );
      },
    },
  ];
  const useDeleteRoom = useMutation((id: number) => deleteroom.execute(id));
  const useJitsiJoinMeeting = () => {
    return useMutation((data: { roomId: number; name: string }) =>
      jitsiJoinMeeting.execute(data)
    );
  };
  const { mutate } = useJitsiJoinMeeting();
  const handleDeleteRoom = (id: number) => {
    useDeleteRoom.mutate(id, {
      onSuccess: (response: any) => {
        const { data }: any = response;
        if (data == "deleted") {
          handleOnToast(
            "Successfully Deleted Room",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
          getAllRooms();
        }
      },
    });
  };
  const joinJitsi = (
    status: string,
    url: string,
    isprivate: string,
    roomId: number
  ) => {
    if (status == "0") {
      handleOnToast(
        "This room is unavailable",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "error"
      );
    } else if (isprivate == "1") {
      // show modal for entering password
      setIsPrivate(true);
    } else {
      setOpen(!open);
      setRoomId(roomId);
      setUrl(url);
    }
  };
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      if(data?.preloadedAccessLevels == 1) {
        setLoading(false)
        checkAuthentication("admin");
      } else {
        router.push('/sys-admin/auth/dashboardauth')
      }
    }, 3000)
  }, []);
  const handleContinue = () => {
    handleSubmit((values) => {
      const obj = {
        roomId: roomId,
        name: values.name,
      };
      setJoinAtom(values);
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == "joined") {
            router.push(url);
          } else {
            handleOnToast(
              "Name already exists, Please try a different one.",
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
        },
      });
    })();
    return false;
  };
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
              text="Digital Meeting Powered By Jitsi"
            />
            <ControlledTabs
              value={valueChange}
              handleChange={handleChange}
              tabsinject={[
                {
                  label: "Create a Meeting",
                },
                {
                  label: "Meeting List",
                },
              ]}
            >
              {valueChange == 0 ? (
                <>
                  <StartupPage />
                </>
              ) : (
                <>
                  <ProjectTable
                    columns={columns}
                    data={rooms}
                    sx={{ marginTop: "10px" }}
                    rowIsCreativeDesign={false}
                  />
                </>
              )}
            </ControlledTabs>
          </UncontrolledCard>
          <ControlledModal
            open={open}
            title="Join Meeting"
            color="primary"
            buttonTextAccept="JOIN"
            buttonTextDecline="CANCEL"
            handleClose={() => setOpen(false)}
            handleDecline={() => setOpen(false)}
            handleSubmit={handleContinue}
          >
            <FormProvider {...form}>
              <JoinForm isprivate={isPrivate} />
            </FormProvider>
          </ControlledModal>
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

export default DigitalMeet;
