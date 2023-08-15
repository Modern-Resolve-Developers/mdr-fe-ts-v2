import DashboardLayout from "@/components/DashboardLayout";
import { ControlledTypography, UncontrolledCard } from "@/components";
import {
  Container,
  TextField,
  InputAdornment,
  Typography,
  ListItemIcon,
} from "@mui/material";
import { TaskList } from "@/components/TaskManagement/list";
import { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { ControlledModal } from "@/components";

// atom from task info and assignee
import {
  taskAssigneeAtom,
  taskInformationAtom,
} from "@/utils/hooks/useAccountAdditionValues";
import { useAtom } from "jotai";

import { useApiCallBack } from "@/utils/hooks/useApi";
import { ControlledBackdrop } from "@/components";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { TableSearchContextMigrate } from "@/utils/context/base/TableSearchContext";
import { TableSearchContextSetup } from "@/utils/context";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddTaskIcon from "@mui/icons-material/AddTask";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { TableSearchProps } from "@/utils/context";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouter } from "next/router";
import { useLoaders } from "@/utils/context/base/LoadingContext";
import { useReferences } from "@/utils/context/hooks/hooks";
const TaskManagementList: React.FC<PageProps> = ({data}) => {
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { tableSearchList, setTableSearchList } = useContext(
    TableSearchContextMigrate
  ) as TableSearchContextSetup;
  const deleteTaskExecutioner = useApiCallBack((api, uuid: any) =>
    api.mdr.deletionTask(uuid)
  );
  const { signoutProcess, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken, disableRefreshTokenCalled, requestNum, devicePromptApproval, requestGetNums, approveIncomingDevice, cookies } = useAuthContext();
    const { setLoading } = useLoaders()
   const [references, setReferences] = useReferences()
   const [devicePrompt, setDevicePrompt] = useState<boolean>(false)
  const fetchAllTask = useApiCallBack((api) => api.mdr.fetchAllTask());
  const [searched, setSearched] = useState<string>("");
  const [taskOriginalArray, setTaskOriginalArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [pg, setpg] = useState(0);
  const [rpg, setrpg] = useState(5);
  const [backdrop, setBackdrop] = useState(false);
  const [preload, setPreLoad] = useState(true);
  const [taskInfoAtom, setTaskInfoAtom] = useAtom(taskInformationAtom);
  const [task_uuid, setTaskUUID] = useState(0);
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const router = useRouter()
  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  const fetchAllTaskDynamically = () => {
    fetchAllTask.execute().then((res: any) => {
      const { data }: any = res;
      setTableSearchList(data);
    });
  };
  useEffect(() => {
    fetchAllTaskDynamically();
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
  const globalSearch = (): TableSearchProps[] => {
    const filteredRepositories = tableSearchList.filter((value: any) => {
      return (
        value?.title?.toLowerCase().includes(searched?.toLowerCase()) ||
        value?.taskCode
          ?.toString()
          .toLowerCase()
          .includes(searched?.toLowerCase())
      );
    });
    return filteredRepositories;
  };

  const handleChangePage = (event: any, newpage: any) => {
    setpg(newpage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  };

  const handleChangeEdit = (props: any) => {
    setOpen(!open);
    const objInfoForAtom = {
      title: props?.title,
      description: props?.description,
      priority: props?.priority,
      subtask: props?.subtask,
      imgurl: props?.imgurl,
    };
    setTaskInfoAtom(objInfoForAtom);
  };

  const handleChangeDelete = (uuid: any) => {
    setOpen(!open);
    setTaskUUID(uuid);
  };

  const handleConfirmDelete = () => {
    setBackdrop(!backdrop);
    if (task_uuid != undefined) {
      deleteTaskExecutioner.execute(task_uuid).then((response: any) => {
        const { data }: any = response;
        if (data == "success_delete") {
          setOpen(false);
          setTaskUUID(0);
          setBackdrop(false);
          handleOnToast(
            "Successfully deleted.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
          fetchAllTaskDynamically();
        }
      });
    }
  };

  const filterTableSearchList: TableSearchProps[] | [] = searched
    ? globalSearch()
    : tableSearchList;
  return (
    <>
      {preload ? (
        <ControlledBackdrop open={preload} />
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
              text="Task Management > Task list"
            />
            <TextField
              value={searched}
              onChange={(event) => setSearched(event.target.value)}
              fullWidth
              sx={{ mb: 1 }}
              placeholder="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TaskList
              tasks={filterTableSearchList && filterTableSearchList}
              currentPage={pg}
              rowsPerPage={rpg}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              handleChangeEdit={handleChangeEdit}
              handleChangeDelete={handleChangeDelete}
            />
          </UncontrolledCard>
          <ControlledModal
            open={open}
            handleClose={handleConfirmDelete}
            handleDecline={() => setOpen(false)}
            title={"Task Deletion"}
            children={
              <>
                <Typography variant="subtitle1">
                  Are you sure you want to delete this task?
                </Typography>
              </>
            }
            buttonTextAccept="DELETE"
            buttonTextDecline="CANCEL"
            color="error"
          />
          <ControlledBackdrop open={backdrop} />
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


export default TaskManagementList;
