import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext } from "react";
import { buildHttp } from "../api/http";

import {
  ControlledBackdrop,
  ControlledGrid,
  UncontrolledCard,
  ControlledTypography,
} from "@/components";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { useRouter } from "next/router";

import { Container, Grid, ListItemIcon } from "@mui/material";

import exportingInit from "highcharts/modules/exporting";
import offlineExporting from "highcharts/modules/offline-exporting";
import Highcharts, { Chart } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useApiCallBack } from "@/utils/hooks/useApi";

import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useQuery } from "react-query";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { DashboardSettingsProps } from "@/components/settings";
if (typeof Highcharts === "object") {
  exportingInit(Highcharts);
  offlineExporting(Highcharts);
}

const TestAdminDashboard: React.FC = () => {
  const { checkAuthentication } = useAuthContext();
  const [loading, setLoading] = useState(true);
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
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { data, error } = useQuery({
    queryKey: "FetchUsersReport",
    queryFn: () => FetchUsersReport.execute().then((response) => response.data),
  });
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");

  const { getPropsDynamic } = useDynamicDashboardContext();
  const [dynamicDashboardEnabled, setDynamicDashboardEnabled] = useState(false);
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
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [accessSavedAuth, accessUserId]);

  return (
    <>
      {loading ? (
        <ControlledBackdrop open={loading} />
      ) : (
        <Container>
          <ControlledGrid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Internal Developers"
                  style={{
                    color: "white",
                  }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Clients"
                  style={{
                    color: "white",
                  }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Ready Products"
                  style={{ color: "white" }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
            <Grid item xs={3}>
              <UncontrolledCard
                style={{
                  background: "#153D77",
                }}
              >
                <ControlledTypography
                  variant="subtitle1"
                  isGutterBottom={true}
                  text="Sales"
                  style={{ color: "white" }}
                />
                <ControlledTypography
                  variant="h6"
                  isGutterBottom={false}
                  text="0"
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    color: "white",
                  }}
                />
              </UncontrolledCard>
            </Grid>
          </ControlledGrid>
          <UncontrolledCard style={{ marginTop: "10px", borderRadius: "25px" }}>
            <ControlledTypography
              variant="subtitle1"
              isGutterBottom={true}
              text="Overall users"
            />
            <HighchartsReact highcharts={Highcharts} options={options} />
          </UncontrolledCard>
        </Container>
      )}
    </>
  );
};

export default TestAdminDashboard;
