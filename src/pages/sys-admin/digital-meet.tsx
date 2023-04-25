import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledChip,
  ControlledTypography,
  ProjectTable,
  UncontrolledCard,
} from "@/components";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { Container } from "@mui/material";
import { StartupPage } from "@/components/Jitsi/StartupPage";
import { ControlledTabs } from "@/components/Tabs/Tabs";
import { useEffect, useState } from "react";
import { useMeetContext } from "@/utils/context/base/MeetContext";
import { NormalButton } from "@/components/Button/NormalButton";
import { useRouter } from "next/router";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
const DigitalMeet: React.FC = () => {
  const [valueChange, setValueChange] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueChange(newValue);
  };
  const router = useRouter();
  const { getAllRooms, rooms, setRooms } = useMeetContext();
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
      field: "roomUrl",
      headerName: "Room URL",
      sortable: false,
      width: 200,
    },
    {
      field: "roomStatus",
      headerName: "Room Status",
      sortable: false,
      width: 130,
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
      width: 100,
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
        if (params.row.roomStatus == "2") {
          return (
            <div style={{ padding: "2vh" }}>
              <NormalButton variant="text" children="DELETE" color="error" />
            </div>
          );
        } else if (params.row.roomStatus == "1") {
          return (
            <div style={{ padding: "2vh" }}>
              <NormalButton
                variant="outlined"
                onClick={() => router.push(params.row.roomUrl)}
                size="small"
                children="JOIN"
                color="success"
              />
            </div>
          );
        }
      },
    },
  ];
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");

  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
      setIdentifiedUser(repo?.data);
    });
  }, []);
  return (
    <DashboardLayout
      sidebarConfig={
        idetifiedUser == "Administrator"
          ? sidebarList
          : idetifiedUser == "Developers"
          ? []
          : []
      }
      subsidebarConfig={
        idetifiedUser == "Administrator"
          ? sidebarExpand
          : idetifiedUser == "Developers"
          ? []
          : []
      }
    >
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
      </Container>
    </DashboardLayout>
  );
};

export default DigitalMeet;
