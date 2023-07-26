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
import { PageProps } from "@/utils/types";
import { GetServerSideProps } from "next";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useRouting } from "@/utils/context/hooks/hooks";
import { useGlobalsContext } from "@/utils/context/base/GlobalContext";
if (typeof Highcharts === "object") {
  exportingInit(Highcharts);
  offlineExporting(Highcharts);
}



const TestAdminDashboard: React.FC<PageProps> = ({data}) => {
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
  const router = useRouter()
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");
  const [dr, setDr] = useRouting()
  const { getPropsDynamic } = useDynamicDashboardContext();
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage){
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  const calculateReport = () => {
    FetchUsersReport.execute()
    .then((response) => {
      for (var x = 0; x < response.data?.length; x++) {
        var ifExist = 0;
        if (options.series.length > 0) {
          for (var check = 0; check < options.series.length; check++) {
            if (response.data[x]?.email == options.series[check]?.name) {
              ifExist = 1;
              check = options.series.length;
              options.series = [];
              var structure1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (
                var structureCount1 = 0;
                structureCount1 < response.data?.length;
                structureCount1++
              ) {
                if (response.data[structureCount1]?.email == response.data[x]?.email) {
                  structure1[response.data[structureCount1]?.id] =
                    response.data[structureCount1]?.id;
                }
              }
              setOptions({ series: [{ data: structure1 }] });
            }
            if (ifExist == 0) {
              var structure = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (
                var structureCount = 0;
                structureCount < response.data?.length;
                structureCount++
              ) {
                if (response.data[structureCount]?.email == response.data[x]?.email) {
                  structure[structureCount] = response.data[structureCount]?.id;
                }
              }
              setOptions({ series: [{ data: structure }] });
            }
          }
        }
      }
    })
  };
  useEffect(() => {
    calculateReport();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if(data?.preloadedAccessLevels == 1){
        setLoading(false)
        checkAuthentication("admin")
      } else {
        router.push('/sys-admin/auth/dashboardauth')
      }
    }, 3000);
  }, []);

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

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const preloadedAccessLevels = await getSecretsIdentifiedAccessLevel(1)
    return { props : { data: { preloadedAccessLevels }}}
  } catch (error) {
    console.log(`Error on get Notification response: ${JSON.stringify(error)} . `)
    return { props : {error}}
  }
}

export default TestAdminDashboard;
