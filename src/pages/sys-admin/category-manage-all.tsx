import {
  ControlledTypography,
  UncontrolledCard,
  ControlledGrid,
  ControlledChip,
  ControlledBackdrop,
} from "@/components";
import { ControlledTabs } from "@/components/Tabs/Tabs";
import { Container } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledSelectField } from "@/components/SelectField";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { LoadingButton } from "@/components/Button/LoadingButton";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { categoryManagementAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useRouter } from "next/router";
import { ProjectTable } from "@/components";
import { ControlledPopoverButton } from "@/components/Button/PopoverButton";
import { NormalButton } from "@/components/Button/NormalButton";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { categoryManagementCreation, categoryManagementBaseSchema } from "@/utils/schema/Sys-adminSchema/Category-manageSchema";
import { useUserId } from "@/utils/context/hooks/hooks";

const CategoryForm = () => {
  const [categoryType, setCategoryType] = useState<
    Array<{
      label: string;
      value: string;
      name: string;
    }>
  >([
    {
      label: "Features Category",
      value: "features",
      name: "Features Category",
    },
    {
      label: "Project Type",
      name: "Project Type",
      value: "project_type",
    },
  ]);
  const { control } = useFormContext<categoryManagementCreation>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            required
            name="label"
            label="Enter category label"
            shouldUnregister
            placeholder="Enter new category label"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="type"
            options={categoryType}
            label="Category Type"
            required
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};

const CategoryManageAll: React.FC = () => {
  const [categoryManageAtom, setCategoryManageAtom] = useAtom(
    categoryManagementAtom
  );
  const [preload, setPreLoad] = useState(true);
  const [valueChange, setValueChange] = useState(0);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setValueChange(newValue);
  };
  const { signoutProcess, tokenExpired, disableRefreshTokenCalled, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
  const router = useRouter();
  const CreationProductCategory = useApiCallBack(
    async (api, args: { label: string; value: string; type: string }) =>
      await api.mdr.CreateProductCategory(args)
  );
  const GetAllProductCategory = useApiCallBack((api) =>
    api.mdr.FetchAllCategories()
  );
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const form = useForm<categoryManagementCreation>({
    resolver: zodResolver(categoryManagementBaseSchema),
    mode: "all",
    defaultValues: categoryManageAtom,
  });
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categoryData, setCategoryData] = useState([])
  const handleShowPopOver = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: any
  ) => {
    setCategoryId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const columns: any[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "label",
      headerName: "Category Name",
      sortable: false,
      width: 160,
    },
    {
      field: "type",
      headerName: "Category Type",
      sortable: false,
      width: 160,
      renderCell: (params: any) => {
        if (params.row.type == "features") {
          return (
            <ControlledChip label="Features" color="success" size={"small"} />
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
            open={open}
            anchorEl={anchorEl}
            handleShowPopOver={(e) => handleShowPopOver(e, params.row.id)}
            handleClosePopOver={handleClosePopOver}
            id={id}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div style={{ padding: "2vh" }}>
              <NormalButton variant="text" children="DELETE" color="error" />
            </div>
          </ControlledPopoverButton>
        );
      },
    },
  ];
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");

  const { getPropsDynamic } = useDynamicDashboardContext();
  const [uid, setUid] = useUserId()
  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
  useEffect(() => {
    if(!accessToken || accessToken == undefined) {
      router.push('/login')
      setTimeout(() => setPreLoad(false), 2000)
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
    if(!disableRefreshTokenCalled){
      if(isMouseMoved) {
        refreshTokenBeingCalled()
      }
    }
  }, [isMouseMoved, disableRefreshTokenCalled])
  useEffect(() => {
    if(!disableRefreshTokenCalled){
      if(isKeyPressed){
        refreshTokenBeingCalled()
      }
    }
  }, [isKeyPressed, disableRefreshTokenCalled])
  const {
    formState: { isValid },
    handleSubmit,
    reset,
    setValue,
  } = form;
  useEffect(() => {
    GetAllProductCategory.execute().then((response: any) => {
      setCategoryData(response.data)
    }).catch(error => {
      if(error.response?.status === 401) {
        router.push('/sys-admin/auth/dashboardauth')
      }
    })
  }, [])
  const handleContinue = () => {
    handleSubmit((values) => {
      setLoading(!loading);
      let newString = values.label.replace(/\s+/g, "_").toLowerCase();
      const obj = {
        label: values.label,
        value: newString,
        type: values.type,
      };
      CreationProductCategory.execute(obj)
        .then((response: any) => {
          const { data }: any = response;
          if (data == 200) {
            setLoading(false);
            handleOnToast(
              "Successfully Added.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            reset({});
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error?.response?.status == 401) {
            handleOnToast(
              "Token Expired.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            localStorage.clear();
            router.push("/login");
          }
        });
    })();
    return false;
  };
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
              text="Categories Management"
            />
            <ControlledTabs
              value={valueChange}
              handleChange={handleChangeTabs}
              tabsinject={[
                {
                  label: "Add new categories",
                },
                {
                  label: "Categories List",
                },
              ]}
            >
              {valueChange == 0 ? (
                <>
                  <FormProvider {...form}>
                    <CategoryForm />
                    <LoadingButton
                      variant="outlined"
                      color="info"
                      loading={loading}
                      onClick={handleContinue}
                      style={{
                        float: "right",
                        marginTop: "10px",
                        marginBottom: "10px",
                      }}
                    />
                  </FormProvider>
                </>
              ) : (
                <>
                  <ProjectTable
                        columns={columns}
                        data={categoryData}
                        sx={{ marginTop: "10px" }}
                        rowIsCreativeDesign={false} loading={false}                  />
                </>
              )}
            </ControlledTabs>
          </UncontrolledCard>
        </Container>
      )}
    </>
  );
};

export default CategoryManageAll;
