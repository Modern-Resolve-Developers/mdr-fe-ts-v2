import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext } from "react";
import { buildHttp } from "../api/http";

import {
  ControlledBackdrop,
  ControlledGrid,
  UncontrolledCard,
  ControlledTypography,
  ProjectTable,
  ControlledHighCharts,
} from "@/components";
import { ControlledStorage } from "@/utils/storage";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { ContextSetup } from "@/utils/context";
import {
  ARContext,
  AuthenticationProps,
} from "@/utils/context/base/AdminRegistrationContext";

import { useRouter } from "next/router";

import { Container, Grid, ListItemIcon } from "@mui/material";

import exportingInit from "highcharts/modules/exporting";
import offlineExporting from "highcharts/modules/offline-exporting";
import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";

import { useApiCallBack } from "@/utils/hooks/useApi";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddTaskIcon from "@mui/icons-material/AddTask";

import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useQuery } from "react-query";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";

if (typeof Highcharts === "object") {
  exportingInit(Highcharts);
  offlineExporting(Highcharts);
}

const TestAdminDashboard: React.FC = () => {
  const router = useRouter();
  const [savedAuth, setSavedAuth] = useState({});
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState([]);
  const { checkAuthentication } = useAuthContext();
  const [options, setOptions] = useState<any>({
    chart: {
      type: "spline",
    },
    tooltip: {
      valueSuffix: " user counts",
      crosshairs: true,
      shared: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [{ data: [] }],
    subtitle: {
      text: "Line Graph",
    },
    title: {
      text: "Users Overall Count",
    },
  });
  const FetchUsersReport = useApiCallBack((api) => api.mdr.fetchUsersReport());
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { data, error } = useQuery({
    queryKey: "FetchUsersReport",
    queryFn: () => FetchUsersReport.execute().then((response) => response.data),
  });
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");

  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
      setIdentifiedUser(repo?.data);
    });
  }, []);
  const calculateReport = () => {
    for (var x = 0; x < data?.length; x++) {
      var ifExist = 0;
      if (options.series.length > 0) {
        for (var check = 0; check < options.series.length; check++) {
          if (data[x]?.email == options.series[check]?.name) {
            ifExist = 1;
            check = options.series.length;
            options.series = [];
            var structure1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (
              var structureCount1 = 0;
              structureCount1 < data?.length;
              structureCount1++
            ) {
              if (data[structureCount1]?.email == data[x]?.email) {
                structure1[data[structureCount1]?.id] =
                  data[structureCount1]?.id;
              }
            }
            setOptions({ series: [{ data: structure1 }] });
          }
          if (ifExist == 0) {
            var structure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (
              var structureCount = 0;
              structureCount < data?.length;
              structureCount++
            ) {
              if (data[structureCount]?.email == data[x]?.email) {
                structure[structureCount] = data[structureCount]?.id;
              }
            }
            setOptions({ series: [{ data: structure }] });
          }
        }
      }
    }
  };
  useEffect(() => {
    calculateReport();
  }, [data]);

  useEffect(() => {
    checkAuthentication("admin");
  }, [accessSavedAuth, accessUserId]);
  return (
    <>
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
          <ControlledGrid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background:
                    "linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Internal Developers"
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background:
                    "linear-gradient(to left, #a770ef, #cf8bf3, #fdb99b)",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Clients"
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background:
                    "linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Ready Products"
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background:
                    "linear-gradient(to left, #a770ef, #cf8bf3, #fdb99b)",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Sales"
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                  }}
                />
              </UncontrolledCard>
            </Grid>
          </ControlledGrid>
          <UncontrolledCard style={{ marginTop: "10px" }}>
            <ControlledTypography
              variant="subtitle1"
              isGutterBottom={true}
              text="Overall users"
            />
            <HighchartsReact highcharts={Highcharts} options={options} />
          </UncontrolledCard>
        </Container>
      </DashboardLayout>
      <ControlledBackdrop open={open} />
    </>
  );
};

export default TestAdminDashboard;
