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
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
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
    if(!accessToken || accessToken == undefined) {
      router.push('/login')
      setTimeout(() => {
        setPreLoad(false)
      }, 2000)
    } else {
      setPreLoad(false)
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
        </Container>
      )}
    </>
  );
};


export default TaskManagementList;
