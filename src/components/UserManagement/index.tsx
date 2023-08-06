import { Container, Box, Typography, Grid } from "@mui/material";
import { OnboardingStepper } from "../Stepper/MuiStepper/MuiStepper";
import { useActiveStep } from "./useActiveStep";
import {
  AccountOwnershipDetailsForm,
  CredentialsOwnershipDetailsForm,
  Completed,
} from "./forms";

import { useEffect, useState, useCallback, useContext } from "react";
import { ControlledTabs } from "../Tabs/Tabs";
import ProjectTable from "../Table/ProjectTable";
import { buildHttp } from "@/pages/api/http";
import ControlledModal from "../Modal/Modal";
import ControlledBackdrop from "../Backdrop/Backdrop";
import ControlledGrid from "../Grid/Grid";

import { ControlledTextField } from "../TextField/TextField";
import { ControlledCheckbox } from "../Checkbox/Checkbox";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

// Atom
import { editFormUserAccountAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useApiCallBack } from "@/utils/hooks/useApi";

import ControlledButton from "../Button/Button";
import ControlledChip from "../Chip/Chip";

import ControlledAvatar from "../Avatar/Avatar";
import { UpdateUsersDetailsArgs } from "@/pages/api/users/types";

// all imported types from api
import { ARContext } from "@/utils/context/base/AdminRegistrationContext";
import { ContextSetup } from "@/utils/context";
import ControlledTypography from "../Typography/Typography";
import { useMutation } from "react-query";

const FORM_MAP: Array<{ label: string; form: React.FC }> = [
  {
    label: "Personal Details",
    form: AccountOwnershipDetailsForm,
  },
  {
    label: "Credentials Details",
    form: CredentialsOwnershipDetailsForm,
  },
  {
    label: "Completed",
    form: Completed,
  },
];

const baseEditFormSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required."),
});

const editFormSchema = z.discriminatedUnion("hasNoMiddleName", [
  z
    .object({
      hasNoMiddleName: z.literal(false),
      middleName: requiredString(
        "Please provide your middlename or select i do not have a middlename."
      ),
    })
    .merge(baseEditFormSchema),
  z
    .object({
      hasNoMiddleName: z.literal(true),
      middleName: z.string().optional(),
    })
    .merge(baseEditFormSchema),
]);

export type EditFormUserAccount = z.infer<typeof editFormSchema>;

export const MAX_UAM_STEPS = FORM_MAP.length;

export const FormAdditionalDetails = () => {
  const init_removeUser = useApiCallBack(async (api, uid: number) =>
    api.users.AccountDeletion(uid)
  );
  const UpdateUsersVerifiedStatusExecutioner = useApiCallBack(
    async (api, args: { identifier: any; uuid: any }) => {
      const result = await api.users.UpdateUsersVerifiedStatusFunc(args);
      return result;
    }
  );
  const updateUsersDetailsExecutioner = useApiCallBack(
    async (api, args: UpdateUsersDetailsArgs) =>
      await api.users.UpdateUsersDetailsFunc(args)
  );
  const [editformAtom, setEditFormAtom] = useAtom(editFormUserAccountAtom);
  const form = useForm<EditFormUserAccount>({
    mode: "all",
    resolver: zodResolver(editFormSchema),
    defaultValues: editformAtom ?? { hasNoMiddleName: false },
  });
  const {
    control,
    formState: { isValid },
    watch,
    trigger,
    handleSubmit,
    reset,
    resetField,
    setValue,
  } = form;
  const { activeStep } = useActiveStep();
  const { label, form: ActiveForm } = FORM_MAP[activeStep];
  const [valueChange, setValueChange] = useState(0);

  const [open, setOpen] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [usersdata, setUsersData] = useState({
    id: 0,
  });
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteUID, setDeleteUID] = useState({ id: 0 });
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { 
    users, 
    callBackSyncGetAllUsers, 
    isLoading, 
    setLoading,
  } = useContext(
    ARContext
  ) as ContextSetup;
  const [modalDetails, setModalDetails] = useState({
    title: "",
    details: "",
    buttonTextAccept: "",
    buttonTextDecline: "",
    color: "",
  });
  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueChange(newValue);
  };
  const columns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fullName",
      headerName: "Full Name",
      description: "This column has a value getter and is not sortable",
      sortable: false,
      width: 160,
      valueGetter: (params: any) =>
        `${params.row.firstname || ""} ${params.row.middlename || ""} ${
          params.row.lastname || ""
        }`,
    },
    {
      field: "imgurl",
      headerName: "Avatar",
      width: 130,
      renderCell: (params: any) => (
        <>
          <ControlledAvatar alt="user avatar" url={params.row.imgurl} />
        </>
      ),
    },
    {
      field: "userType",
      headerName: "User Control",
      width: 130,
      renderCell: (params: any) => {
        if (params.value == "1") {
          return (
            <>
              <ControlledChip
                label="Administrator"
                color="success"
                size={"small"}
              />
            </>
          );
        } else if (params.value == "2") {
          return (
            <>
              <ControlledChip
                label="Developer"
                color="primary"
                size={"small"}
              />
            </>
          );
        } else {
          return (
            <>
              <ControlledChip label="Client" color="info" size={"small"} />
            </>
          );
        }
      },
    },
    {
      field: "verified",
      headerName: "Verified",
      width: 130,
      renderCell: (params: any) => {
        if (params.value == "1") {
          return (
            <>
              <ControlledChip label="Verified" color="success" size={"small"} />
            </>
          );
        } else {
          return (
            <>
              <ControlledChip
                label="Not Verified"
                color="error"
                size={"small"}
              />
            </>
          );
        }
      },
    },
    {
      field: "isstatus",
      headerName: "Status",
      width: 100,
      renderCell: (params: any) => {
        if (params.value == "1") {
          return (
            <>
              <ControlledChip label="Lock" color="error" size={"small"} />
            </>
          );
        } else {
          return (
            <>
              <ControlledChip label="Access" color="success" size={"small"} />
            </>
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 300,
      sortable: false,
      renderCell: (params: any) => (
        <>
          <div
            style={{
              display: "flex",
            }}
          >
            <ControlledButton
              text="EDIT"
              variant="outlined"
              color="primary"
              size="small"
              onClick={() =>
                handleClickProjectTable({
                  id: params.row.id,
                  propstype: "edit",
                  firstname: params.row.firstname,
                  middlename: params.row.middlename,
                  lastname: params.row.lastname,
                })
              }
            />{" "}
            &nbsp;
            {params.row.verified.includes(1) ? (
              <></>
            ) : (
              <>
                <ControlledButton
                  text="Verify"
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() =>
                    handleClickProjectTable({
                      id: params.row.id,
                      propstype: "verify",
                    })
                  }
                />
              </>
            )}{" "}
            &nbsp;
            {params.row.isstatus.includes(1) ? (
              <>
                <ControlledButton
                  text="Unlock"
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() =>
                    handleClickProjectTable({
                      id: params.row.id,
                      propstype: "unlock",
                    })
                  }
                />
              </>
            ) : (
              <>
                {params.row.userType != 1 && (
                  <ControlledButton
                    text="Lock"
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() =>
                      handleClickProjectTable({
                        id: params.row.id,
                        propstype: "lock",
                      })
                    }
                  />
                )}
              </>
            )}
            &nbsp;
            {params.row.userType != 1 && params.row.isstatus.includes(1) && (
              <ControlledButton
                text="DELETE"
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleuamDelete(params.row.id)}
              />
            )}
          </div>
        </>
      ),
    },
  ];
  const handleuamDelete = (uid: number) => {
    setDeleteModal(!deleteModal);
    setDeleteUID({ ...deleteUID, id: uid });
  };
  const handleYes = () => {
    setBackdrop(!backdrop);
    setDeleteModal(false);
    init_removeUser.execute(deleteUID.id).then((response: any) => {
      const { data }: any = response;
      if (data == 200) {
        setBackdrop(false);
        handleOnToast(
          "Successfully Deleted.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        callBackSyncGetAllUsers();
      }
    });
  };
  const useUpdateUsersDetails = () => {
    return useMutation((data: UpdateUsersDetailsArgs) =>
      updateUsersDetailsExecutioner
        .execute(data)
        .then((response: any) => response.data)
    );
  };
  const { mutate } = useUpdateUsersDetails();
  const handleContinue = () => {
    setBackdrop(!backdrop);
    handleSubmit((values) => {
      setEditModal(false);
      const edit_uam_request_data = {
        id: usersdata.id,
        firstname: values.firstName,
        middlename: values.middleName,
        lastname: values.lastName,
      };
      mutate(edit_uam_request_data, {
        onSuccess: (response) => {
          if (response == 200) {
            setBackdrop(false);
            handleOnToast(
              "Successfully Modify User.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            setUsersData((prevState) => ({
              ...prevState,
              id: 0,
            }));
            reset({});
            callBackSyncGetAllUsers();
          }
        },
      });
    })();
    return false;
  };
  const handleClickProjectTable = useCallback((props: any) => {
    const { id, propstype, firstname, middlename, lastname }: any = props;
    switch (propstype) {
      case "edit":
        const values = {
          firstName: firstname,
          middleName: middlename,
          lastName: lastname,
          hasNoMiddleName:
            middlename == null || middlename == "" ? false : true,
        };
        setEditFormAtom(values);
        setValue("firstName", firstname);
        if (middlename == null || middlename == "" || middlename == "N/A") {
          setValue("middleName", middlename);
          setValue("hasNoMiddleName", true);
        } else {
          setValue("middleName", middlename);
          setValue("hasNoMiddleName", false);
        }
        setValue("lastName", lastname);
        setEditModal(!editModal);
        setUsersData((prevState) => ({
          ...prevState,
          id: id,
        }));
        break;
      case "unlock":
        setOpen(!open);
        setModalDetails((prevState) => ({
          ...prevState,
          title: "Account Unlock",
          details: "Are you sure you want to unlock this account?",
          buttonTextAccept: "YES",
          buttonTextDecline: "NO",
          color: "success",
        }));

        setUsersData((prevState) => ({
          ...prevState,
          id: id,
        }));
        setIdentifier("unlock");
        break;
      case "lock":
        setOpen(!open);
        setModalDetails((prevState) => ({
          ...prevState,
          title: "Account Lock",
          details: "Are you sure you want to lock this account?",
          buttonTextAccept: "YES",
          buttonTextDecline: "NO",
          color: "success",
        }));
        setUsersData((prevState) => ({
          ...prevState,
          id: id,
        }));
        setIdentifier("lock");
        break;
      case "verify":
        setOpen(!open);
        setModalDetails((prevState) => ({
          ...prevState,
          title: "Verify Account",
          details: "Are you sure you want to verify this account?",
          buttonTextAccept: "YES",
          buttonTextDecline: "NO",
          color: "success",
        }));
        setUsersData((prevState) => ({
          ...prevState,
          id: id,
        }));
        setIdentifier("verify");
        break;
      default:
        break;
    }
  }, []);
  const OnModalClose = () => {
    switch (identifier) {
      case "unlock":
        setBackdrop(!backdrop);
        const argsUnlock = {
          identifier: identifier,
          uuid: usersdata.id,
        };
        UpdateUsersVerifiedStatusExecutioner.execute(argsUnlock).then(
          (repository: any) => {
            const { data }: any = repository;
            if (data === 200) {
              handleOnToast(
                "Successfully Unlock.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
              setOpen(!open);
              setModalDetails((prevState) => ({ ...prevState }));
              setIdentifier("");
              setUsersData((prevState) => ({
                ...prevState,
                id: 0,
              }));
              callBackSyncGetAllUsers();
            }
          }
        );
        break;
      case "lock":
        setBackdrop(!backdrop);
        const argsLock = {
          identifier: identifier,
          uuid: usersdata.id,
        };
        UpdateUsersVerifiedStatusExecutioner.execute(argsLock).then(
          (repository: any) => {
            const { data }: any = repository;
            if (data === 200) {
              handleOnToast(
                "Successfully Lock.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
              setOpen(!open);
              setModalDetails((prevState) => ({ ...prevState }));
              setIdentifier("");
              setUsersData((prevState) => ({
                ...prevState,
                id: 0,
              }));
              callBackSyncGetAllUsers();
            }
          }
        );
        break;
      case "verify":
        setBackdrop(!backdrop);
        const argsVerify = {
          identifier: identifier,
          uuid: usersdata.id,
        };
        UpdateUsersVerifiedStatusExecutioner.execute(argsVerify).then(
          (repository: any) => {
            const { data }: any = repository;
            if (data === 200) {
              handleOnToast(
                "Successfully Verified.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              setBackdrop(false);
              setOpen(!open);
              setModalDetails((prevState) => ({ ...prevState }));
              setIdentifier("");
              setUsersData((prevState) => ({
                ...prevState,
                id: 0,
              }));
              callBackSyncGetAllUsers();
            }
          }
        );
        break;
      default:
        setOpen(false);
        setIdentifier("");
        break;
    }
  };
  useEffect(() => {
    callBackSyncGetAllUsers();
    setLoading(false);
  }, []);
  useEffect(() => {
    setValue("middleName", "N/A");
    if (hasNoMiddleNamePrevValue) {
      trigger("middleName");
    }
  }, [hasNoMiddleName, hasNoMiddleNamePrevValue, resetField, trigger]);
  useEffect(() => {
    setLoading(true);
    if(users.length > 0) {
      setLoading(false);
    }
  }, [users]);
  return (
    <FormProvider {...form}>
      <Container>
        <ControlledTabs
          value={valueChange}
          handleChange={handleChange}
          tabsinject={[
            {
              label: "Add new user",
            },
            {
              label: "Users List",
            },
          ]}
        >
          {valueChange == 0 ? (
            <>
              <OnboardingStepper
                steps={[
                  "Basic Information",
                  "Credentials Information",
                  "Completed",
                ]}
                sx={{ mt: 3 }}
                activeStep={activeStep}
              />
              <Box mt={2} width="100%">
                <ActiveForm />
              </Box>
            </>
          ) : (
            <>
              <ControlledButton
                text="REFRESH"
                variant="outlined"
                color="primary"
                size="small"
                style={{
                  float: "right",
                  margin: 10,
                }}
                onClick={() => callBackSyncGetAllUsers()}
              />
              <ProjectTable
                sx={{ marginTop: "20px", overflowX: "scroll", width: "100%" }}
                data={users}
                handleClick={handleClickProjectTable}
                columns={columns}
                loading={isLoading}
              />
            </>
          )}
        </ControlledTabs>
        <ControlledModal
          open={open}
          title={modalDetails?.title}
          children={
            <Typography variant="subtitle1" gutterBottom>
              {modalDetails?.details}
            </Typography>
          }
          color={modalDetails.color}
          buttonTextAccept={modalDetails.buttonTextAccept}
          buttonTextDecline={modalDetails.buttonTextDecline}
          handleClose={() => setOpen(false)}
          handleSubmit={OnModalClose}
          handleDecline={() => setOpen(false)}
        />
        <ControlledModal
          open={editModal}
          title={"Modify User Information"}
          maxWidth={"lg"}
          children={
            <>
              <ControlledGrid>
                <Grid item xs={6}>
                  <ControlledTextField
                    control={control}
                    required
                    name="firstName"
                    label="Edit your firstname"
                    shouldUnregister
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlledTextField
                    control={control}
                    required={!hasNoMiddleName}
                    name="middleName"
                    label="Edit your middlename"
                    disabled={hasNoMiddleName}
                    shouldUnregister
                  />
                  <ControlledCheckbox
                    control={control}
                    name="hasNoMiddleName"
                    label="I do not have a middle name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <ControlledTextField
                    control={control}
                    required
                    name="lastName"
                    label="Edit your lastname"
                    shouldUnregister
                  />
                </Grid>
              </ControlledGrid>
            </>
          }
          color={"primary"}
          buttonTextAccept={"CONFIRM"}
          buttonTextDecline={"CANCEL"}
          handleClose={() => setEditModal(false)}
          handleSubmit={handleContinue}
          handleDecline={() => setEditModal(false)}
        />
        <ControlledModal
          open={deleteModal}
          title="User Deletion"
          color="primary"
          buttonTextAccept="YES"
          buttonTextDecline="NO"
          handleClose={() => setDeleteModal(false)}
          handleSubmit={handleYes}
          handleDecline={() => setDeleteModal(false)}
        >
          <ControlledTypography
            text="Are you sure you want to delete this user?"
            variant="subtitle1"
          />
        </ControlledModal>
        <ControlledBackdrop open={backdrop} />
      </Container>
    </FormProvider>
  );
};
