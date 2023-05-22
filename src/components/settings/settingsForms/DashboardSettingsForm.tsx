import UncontrolledCard from "@/components/Cards/Card";
import { ControlledSwitch } from "@/components/Switch/Switch";
import { useContext, useEffect, useState } from "react";
import { NormalButton } from "@/components/Button/NormalButton";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation, useQuery } from "react-query";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
export const DashboardSettings = () => {
  const [state, setState] = useState(false);
  const [open, setOpen] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(event.target.checked);
  };
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const changeDynamicDashboardSettings = useApiCallBack(
    async (
      api,
      props: { dynamicDashboardEnabled: string; settingsType: string }
    ) => await api.mdr.changeDynamicDashboardSettings(props)
  );
  const getDynamicDashboardChanges = useApiCallBack((api) =>
    api.mdr.getChangedDynamicDashboardSettings()
  );
  /* code below using useQuery should transfer on 
  context API so it can be called globally on each dashboard setup */
  const { data } = useQuery({
    queryKey: "FetchDynamicDashboardSettings",
    queryFn: () =>
      getDynamicDashboardChanges.execute().then((response) => response.data),
  });
  const useChangeDynamicDashboardSettings = () => {
    return useMutation(
      (props: { dynamicDashboardEnabled: string; settingsType: string }) =>
        changeDynamicDashboardSettings.execute(props)
    );
  };
  useEffect(() => {
    const res =
      data?.length > 0 &&
      data?.map((item: any) => item.dynamicDashboardEnabled);
    console.log(res);
  }, [data]);
  const { mutate } = useChangeDynamicDashboardSettings();
  const handleSave = () => {
    setOpen(!open);
    const obj = {
      dynamicDashboardEnabled: state ? "1" : "0",
      settingsType: "DashboardSettings",
    };
    mutate(obj, {
      onSuccess: (response) => {
        if (response.data == 200) {
          setOpen(false);
          handleOnToast(
            "Successfully Saved!",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
        }
      },
    });
  };
  return (
    <>
      <UncontrolledCard>
        <ControlledSwitch
          checked={state}
          handleChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
          label="Enable Dynamic Dashboard"
        />
        <NormalButton
          sx={{
            float: "right",
            mt: 2,
            mb: 2,
          }}
          variant="outlined"
          size="small"
          children="SAVE"
          onClick={handleSave}
        />
      </UncontrolledCard>
      <ControlledBackdrop open={open} />
    </>
  );
};
