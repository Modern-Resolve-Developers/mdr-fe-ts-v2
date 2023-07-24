import DashboardLayout from "@/components/DashboardLayout";
import {
  ControlledTypography,
  UncontrolledCard,
  ControlledGrid,
  ControlledChip,
  ControlledBackdrop,
} from "@/components";
import { ControlledTabs } from "@/components/Tabs/Tabs";
import { Container, Typography } from "@mui/material";
import { sidebarList, sidebarExpand } from "@/utils/sys-routing/sys-routing";

import { useCallback, useContext, useEffect, useState } from "react";

import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledSelectField } from "@/components/SelectField";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
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
import { useQuery } from "react-query";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { useAuthContext } from "@/utils/context/base/AuthContext";
const categoryManagementBaseSchema = z.object({
  label: requiredString("Label is required."),
  type: requiredString("kindly select type."),
});
export type categoryManagementCreation = z.infer<
  typeof categoryManagementBaseSchema
>;
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
  const { checkAuthentication } = useAuthContext();
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
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

  useEffect(() => {
    getPropsDynamic(localStorage.getItem("uid")).then((repo: any) => {
      setIdentifiedUser(repo?.data);
    });
  }, []);
  useEffect(() => {
    checkAuthentication("admin");
    setTimeout(() => {
      setPreLoad(false);
    }, 3000);
  }, [accessSavedAuth, accessUserId]);
  const {
    formState: { isValid },
    handleSubmit,
    reset,
    setValue,
  } = form;

  const { data } = useQuery(
    "category-list",
    async () => {
      const result = await GetAllProductCategory.execute();
      return result.data;
    },
    { initialData: undefined }
  );
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
                    data={data}
                    sx={{ marginTop: "10px" }}
                    rowIsCreativeDesign={false}
                  />
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
