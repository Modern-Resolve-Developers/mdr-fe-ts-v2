type DashboardSettings = {
  dashboardId: number;
  dynamicDashboardEnabled: boolean;
  settingsType: string;
};

export const DashboardSettingsProps: DashboardSettings[] = [
  {
    dashboardId: 1,
    dynamicDashboardEnabled: true,
    settingsType: "DashboardSettings",
  },
];
