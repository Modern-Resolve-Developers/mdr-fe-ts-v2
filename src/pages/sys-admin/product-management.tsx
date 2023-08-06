import DashboardLayout from "@/components/DashboardLayout";
import {
  Container,
  Grid,
  Box,
  Avatar,
  Typography,
  Slider,
} from "@mui/material";
import { ControlledTypography, UncontrolledCard } from "@/components";
import {
  sidebarList,
  sidebarExpand,
} from "../../utils/sys-routing/sys-routing";
import { ControlledTabs } from "@/components/Tabs/Tabs";
import storage from "../../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { Peso } from "@/utils/Intl";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";

import { CreateProducts } from "@/pages/api/types";
import { useRouter } from "next/router";

import { ProjectTable } from "@/components";
import { ControlledChip } from "@/components";
import { ControlledTextField } from "@/components/TextField/TextField";
import { ControlledSelectField } from "@/components/SelectField";
import { useContext, useEffect, useState } from "react";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import ControlledGrid from "@/components/Grid/Grid";
import { productManagementAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useAtom } from "jotai";
import { ControlledMultipleSelectField } from "@/components/SelectField/MultipleSelection";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { NormalButton } from "@/components/Button/NormalButton";
import { ControlledProgressWithLabel } from "@/components/Progress/CircularProgress";
import { useDynamicDashboardContext } from "@/utils/context/base/DynamicDashboardContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { ProductManagementCreation, productManagementBaseSchema } from "@/utils/schema/Sys-adminSchema/Product-ManagementShema";

const ProductPricingForm = () => {
  const [isEdit, setIsEdit] = useState(true);
  const [scale, setScale] = useState<
    Array<{
      label: string;
      value: string;
      name: string;
    }>
  >([
    {
      label: "Large Scale",
      value: "large_scale",
      name: "Large Scale",
    },
    {
      label: "Medium Scale",
      value: "medium_scale",
      name: "Medium Scale",
    },
    {
      label: "Small Scale",
      value: "small_scale",
      name: "Small Scale",
    },
  ]);
  const { control, setValue, watch, resetField } =
    useFormContext<ProductManagementCreation>();
  const [slideValue, setSlideValue] = useState(0);
  const installment = watch("installment");
  useEffect(() => {
    if (installment == "no") {
      resetField("installmentInterest");
      resetField("monthlyPaymentSelection");
      resetField("downpaymentRequired");
      resetField("monthlyPaymentRequired");
      resetField("totalAmountBasedOnInstallation");
    }
  }, [installment]);
  /* calc area start */
  const installmentPercentage = watch("installmentInterest");
  const monthsToPay = watch("monthlyPaymentSelection");
  const dpRequired = watch("downpaymentRequired");
  useEffect(() => {
    const dpAmount = slideValue / monthsToPay;
    const dpAmountPercentage = (dpAmount / slideValue) * 100;
    const downPayment = (dpAmountPercentage / 100) * slideValue;
    const interestFromProductPrice = slideValue * installmentPercentage;
    const monthlyPayment =
      (slideValue - (isEdit == false ? dpRequired : downPayment)) /
        monthsToPay +
      interestFromProductPrice;
    const totalAmountWithoutInterest =
      monthlyPayment * monthsToPay + downPayment;
    const totalAmountWithInterest =
      totalAmountWithoutInterest +
      totalAmountWithoutInterest * (installmentPercentage / 100) * monthsToPay;
    if (!monthsToPay) {
      return;
    } else {
      setValue(
        "downpaymentRequired",
        isEdit == false
          ? dpRequired.toLocaleString()
          : downPayment.toLocaleString()
      );
      setValue("monthlyPaymentRequired", monthlyPayment.toLocaleString());
      setValue(
        "totalAmountBasedOnInstallation",
        totalAmountWithInterest.toLocaleString()
      );
    }
  }, [installmentPercentage, monthsToPay, slideValue, dpRequired]);
  /* calc area end */
  const handleSlideChange = (val: any) => {
    setSlideValue(val);
    setValue("productPrice", val);
    if (val > 80000) {
      setValue("projectScale", "large_scale");
    } else if (val > 60000) {
      setValue("projectScale", "medium_scale");
    } else if (val > 20000) {
      setValue("projectScale", "small_scale");
    } else {
      setValue("projectScale", "small_scale");
    }
  };
  const handleOnEditDownPayment = () => {
    setIsEdit(false);
  };
  const handleCancelEditRequredDP = () => {
    setIsEdit(true);
    resetField("installmentInterest");
    resetField("monthlyPaymentSelection");
    resetField("downpaymentRequired");
    resetField("monthlyPaymentRequired");
    resetField("totalAmountBasedOnInstallation");
  };
  const handleSaveEditRequiredDP = () => {
    setIsEdit(true);
  };
  return (
    <>
      <UncontrolledCard className="mt-2">
        <ControlledGrid>
          <Grid item xs={4}>
            <ControlledSelectField
              control={control}
              name="projectScale"
              options={scale}
              label="Project Scale"
              required
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom>
              Product Price : {Peso.format(slideValue)}
            </Typography>
            <Slider
              defaultValue={slideValue}
              style={{ marginTop: "10px" }}
              step={10}
              min={15000}
              max={120000}
              value={slideValue}
              onChange={(e, val) => handleSlideChange(val)}
            />
          </Grid>
          <Grid item xs={4}>
            <ControlledSelectField
              control={control}
              name="installment"
              options={[
                {
                  label: "Yes",
                  value: "yes",
                  name: "Yes",
                },
                {
                  label: "No",
                  value: "no",
                  name: "No",
                },
              ]}
              label="Project Installment"
              required
              disabled={!slideValue}
            />
          </Grid>
        </ControlledGrid>
        {installment == "yes" ? (
          <>
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledSelectField
                  control={control}
                  name="installmentInterest"
                  options={[
                    {
                      label: "0.03%",
                      value: 0.03,
                      name: "0.03%",
                    },
                  ]}
                  label="Installment Interest Required"
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledSelectField
                  control={control}
                  name="monthlyPaymentSelection"
                  options={[
                    {
                      label: "12 Months",
                      value: 12,
                      name: "12 Months",
                    },
                    {
                      label: "36 Months",
                      value: 36,
                      name: "36 Months",
                    },
                    {
                      label: "60 Months",
                      value: 60,
                      name: "60 Months",
                    },
                  ]}
                  label="Months to pay"
                  required
                />
              </Grid>
            </ControlledGrid>
            <ControlledGrid>
              <Grid item xs={4}>
                <ControlledTextField
                  control={control}
                  required
                  name="downpaymentRequired"
                  label="Required Downpayment"
                  shouldUnregister
                  placeholder="Auto generated downpayment"
                  disabled={isEdit}
                />
                {isEdit == false && (
                  <div style={{ display: "flex", float: "right" }}>
                    <NormalButton
                      variant="text"
                      size="small"
                      children="CANCEL"
                      style={{
                        float: "right",
                      }}
                      onClick={handleCancelEditRequredDP}
                    />
                    &nbsp;
                    <NormalButton
                      variant="text"
                      size="small"
                      children="SAVE"
                      style={{
                        float: "right",
                      }}
                      onClick={handleSaveEditRequiredDP}
                    />
                  </div>
                )}
                <NormalButton
                  variant="text"
                  size="small"
                  children="EDIT"
                  style={{
                    float: "right",
                    display: isEdit == false ? "none" : "",
                  }}
                  disabled={!monthsToPay}
                  onClick={handleOnEditDownPayment}
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledTextField
                  control={control}
                  required
                  name="monthlyPaymentRequired"
                  label="Monthly Payment"
                  shouldUnregister
                  placeholder="Auto generated monthly payment"
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledTextField
                  control={control}
                  required
                  name="totalAmountBasedOnInstallation"
                  label="Total Payment"
                  shouldUnregister
                  placeholder="Auto generated total payment"
                  disabled
                />
              </Grid>
            </ControlledGrid>
          </>
        ) : (
          <></>
        )}
      </UncontrolledCard>
    </>
  );
};
const ProductResourceForm = () => {
  const [zipFile, setZipFile] = useState<any>("");
  const [preview, setPreview] = useState<any>(null);
  const [percent, setPercent] = useState(0);
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { control, setValue } = useFormContext<ProductManagementCreation>();

  const handleChangeFileZip = (event: any) => {
    setZipFile(event.target.files[0]);
  };
  const handleUploadZip = () => {
    if (!zipFile) {
      handleOnToast(
        "Please select zip file first.",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "error"
      );
    } else {
      const checkstorage = ref(storage, `/repository/${zipFile.name}`);
      const uploadTask = uploadBytesResumable(checkstorage, zipFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(percent);
        },
        (err: any) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setValue("repositoryUrl", url);
            setPreview(url);
            handleOnToast(
              "Successfully Uploaded.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
          });
        }
      );
    }
  };
  return (
    <>
      <Box className="flex flex-col gap-4 mt-3">
        <Box className="flex flex-col gap-4 lg:flex-row">
          <UncontrolledCard className="p-2 w-full">
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  required
                  name="repositoryName"
                  label="Repository Name"
                  placeholder="e.g my-app-repository"
                  shouldUnregister
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledSelectField
                  control={control}
                  name="repositoryMaintainedBy"
                  options={[
                    {
                      label: "Modern Resolve Core Development Team",
                      value: "mdrcore_team",
                      name: "Modern Resolve Core Development Team",
                    },
                    {
                      label: "Modern Resolve Development Team",
                      value: "mdr_team",
                      name: "Modern Resolve Development Team",
                    },
                  ]}
                  label="Project Maintained By"
                  required
                />
              </Grid>
            </ControlledGrid>
          </UncontrolledCard>
          <UncontrolledCard className="p-2 w-full lg:w-1/4">
            {preview == null ? (
              <Box className="mb-12">
                <label className="flex flex-col w-full h-32 border-4 border-sideBar-200 border-dashed hover:bg-black-100 hover:border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Upload Source Code (Zip files)
                    </p>
                  </div>
                  <input
                    accept="application/zip"
                    onChange={handleChangeFileZip}
                    type="file"
                    className="opacity-0"
                  />
                </label>
              </Box>
            ) : (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  justifyContent: "center",
                  display: "flex",
                }}
                alt="Uploaded pic"
                src={preview}
              />
            )}
            <Typography
              align="center"
              style={{ wordWrap: "break-word" }}
              variant="caption"
              display="block"
            >
              {zipFile.name}
            </Typography>
            <div style={{ display: "flex" }}>
              <NormalButton
                variant="outlined"
                size="small"
                children={"UPLOAD"}
                onClick={handleUploadZip}
              />
              &nbsp;
              <ControlledProgressWithLabel value={percent} />
            </div>
          </UncontrolledCard>
        </Box>
      </Box>
    </>
  );
};
const ProductManagementForm = () => {
  const [prodCategory, setProdCategory] = useState<
    Array<{
      label: string;
      value: string;
      name: string;
    }>
  >([
    {
      label: "POS",
      name: "POS",
      value: "pos",
    },
    {
      label: "TMS",
      name: "TMS",
      value: "tms",
    },
  ]);
  const [projectType, setProjectType] = useState<
    Array<{
      label: string;
      value: string;
      name: string;
    }>
  >([
    {
      label: "Web",
      value: "web",
      name: "Web",
    },
  ]);
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const [file, setFile] = useState<any>("");
  const [percent, setPercent] = useState(0);
  const [preview, setPreview] = useState<any>(null);

  const [prodFeature, setProdFeature] = useState<
    Array<{ id: number; label: string; value: string }>
  >([]);
  const getProductCategory = useApiCallBack((api) =>
    api.mdr.ProductCategoryList()
  );
  const { control, resetField, setValue, watch, trigger, getValues } =
    useFormContext<ProductManagementCreation>();

  useEffect(() => {
    getProductCategory.execute().then((repo: any) => {
      const { data } = repo;
      setProdFeature(data);
    });
  }, []);
  const handleChange = (event: string) => {
    setValue("productDescription", JSON.stringify(event));
  };
  const productDescription = watch("productDescription");
  const productImage = watch("productImage");
  useEffect(() => {
    trigger("productDescription");
    trigger("productImage");
  }, [productDescription, trigger, productImage]);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const handleUploadImage = () => {
    if (!file) {
      handleOnToast(
        "Please select image first.",
        "top-right",
        false,
        true,
        true,
        true,
        undefined,
        "dark",
        "error"
      );
    } else {
      const checkstorage = ref(storage, `/products/${file.name}`);
      const uploadTask = uploadBytesResumable(checkstorage, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setPercent(percent);
        },
        (err: any) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setValue("productImage", url);
            setPreview(url);
            handleOnToast(
              "Successfully Uploaded.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
          });
        }
      );
    }
  };

  return (
    <>
      <Box className="flex flex-col gap-4 mt-3">
        <Box className="flex flex-col gap-4 lg:flex-row">
          <UncontrolledCard className="p-2 w-full">
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  required
                  name="productName"
                  label="Product Name"
                  shouldUnregister
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledRichTextField handleChange={handleChange} />
              </Grid>
            </ControlledGrid>
            <ControlledGrid>
              <Grid item xs={4}>
                <ControlledSelectField
                  control={control}
                  name="productCategory"
                  options={prodCategory}
                  label="Product Category"
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledMultipleSelectField
                  control={control}
                  name="productFeatures"
                  options={prodFeature}
                  label="Select Multiple Features"
                  required
                  shouldUnregister
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledSelectField
                  control={control}
                  name="projectType"
                  options={projectType}
                  label="Project Type"
                  required
                />
              </Grid>
            </ControlledGrid>
          </UncontrolledCard>
          <UncontrolledCard className="p-2 w-full lg:w-1/4">
            {preview == null ? (
              <Box className="mb-12">
                <label className="flex flex-col w-full h-32 border-4 border-sideBar-200 border-dashed hover:bg-black-100 hover:border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                      Upload Images
                    </p>
                  </div>
                  <input
                    accept="/image/*"
                    onChange={handleFileChange}
                    type="file"
                    className="opacity-0"
                  />
                </label>
              </Box>
            ) : (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  justifyContent: "center",
                  display: "flex",
                }}
                alt="Uploaded pic"
                src={preview}
              />
            )}
            <Typography
              align="center"
              style={{ wordWrap: "break-word" }}
              variant="caption"
              display="block"
            >
              {file.name}
            </Typography>
            <div style={{ display: "flex" }}>
              <NormalButton
                variant="outlined"
                size="small"
                children={"UPLOAD"}
                onClick={handleUploadImage}
              />
              &nbsp;
              <ControlledProgressWithLabel value={percent} />
            </div>
          </UncontrolledCard>
        </Box>
      </Box>
    </>
  );
};
const ProductManagement: React.FC = () => {
  const PMGridColumns: any[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "productName",
      headerName: "Product Name",
      sortable: false,
      width: 160,
    },
    {
      field: "productCategory",
      headerName: "Product Category",
      sortable: false,
      width: 160,
    },
    {
      field: "projectType",
      headerName: "Project Type",
      sortable: false,
      width: 130,
    },
    {
      field: "productStatus",
      headerName: "Status",
      width: 130,
      renderCell: (params: any) => {
        if (params.value == "1") {
          return (
            <>
              <ControlledChip label="Active" color="success" size={"small"} />
            </>
          );
        } else {
          return (
            <>
              <ControlledChip label="Inactive" color="error" size={"small"} />
            </>
          );
        }
      },
    },
    {
      field: "IsUnderMaintenance",
      headerName: "Maintenance",
      width: 130,
      renderCell: (params: any) => {
        if (params.value == "1") {
          return (
            <>
              <ControlledChip label="Yes" color="success" size={"small"} />
            </>
          );
        } else {
          return (
            <>
              <ControlledChip label="No" color="error" size={"small"} />
            </>
          );
        }
      },
    },
    {
      headerName: "Actions",
      width: 160,
      renderCell: (params: any) => {
        return (
          <NormalButton
            variant="outlined"
            size="small"
            children="REVOKE"
            color="error"
          />
        );
      },
    },
  ];
  const [productManageAtom, setProductManageAtom] = useAtom(
    productManagementAtom
  );
  const [preload, setPreLoad] = useState(true);
  const PMCreation = useApiCallBack(
    async (api, args: CreateProducts | any) =>
      await api.mdr.ProductManagementCreation(args)
  );
  const PMWhenCreated = useApiCallBack(
    async (api, args: { product_id: any }) =>
      await api.mdr.ProductSystemGen(args)
  );
  const PMList = useApiCallBack((api) => api.mdr.ProductList());
  const [valueChange, setValueChange] = useState(0);
  const [pmlist, setPmList] = useState([]);
  const router = useRouter();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueChange(newValue);
  };
  const { signoutProcess, disableRefreshTokenCalled, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken } = useAuthContext();
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const [open, setOpen] = useState(false);
  const form = useForm<ProductManagementCreation>({
    resolver: zodResolver(productManagementBaseSchema),
    mode: "all",
    defaultValues: productManageAtom,
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
    setValue,
  } = form;

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
  const getAllProducts = () => {
    PMList.execute().then((res: any) => {
      const { data }: any = res;
      setPmList(data);
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleContinue = () => {
    handleSubmit((values) => {
      const obj = {
        productName: values.productName,
        productDescription: values.productDescription,
        productCategory: values.productCategory,
        productFeatures: JSON.stringify(values.productFeatures),
        projectType: values.projectType,
        productImageUrl: values.productImage,
        projectScale: values.projectScale,
        productPrice: parseFloat(values.productPrice),
        projectInstallment: values.installment,
        installmentInterest: parseFloat(values.installmentInterest),
        monthsToPay: values.monthlyPaymentSelection,
        downPayment: parseFloat(values.downpaymentRequired.replaceAll(",", "")),
        monthlyPayment: parseFloat(
          values.monthlyPaymentRequired.replaceAll(",", "")
        ),
        totalPayment: parseFloat(
          values.totalAmountBasedOnInstallation.replaceAll(",", "")
        ),
        repositoryName: values.repositoryName,
        maintainedBy: values.repositoryMaintainedBy,
        repositoryZipUrl: values.repositoryUrl,
        created_by: "Administrator",
      };
      setOpen(!open);
      PMCreation.execute(obj)
        .then((repo: any) => {
          const { data }: any = repo;
          const genesys = {
            product_id: data?.product_id,
          };
          PMWhenCreated.execute(genesys)
            .then((res: any) => {
              if (res?.data == 200) {
                setOpen(false);
                handleOnToast(
                  "Successfully Created Product.",
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
                setValue("productDescription", "");
                setValue("productImage", "");
              }
            })
            .catch((error) => {
              setOpen(false);
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
        })
        .catch((error) => {
          setOpen(false);
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
  const [idetifiedUser, setIdentifiedUser] = useState<any>("");

  const { getPropsDynamic } = useDynamicDashboardContext();

  useEffect(() => {
    if(typeof window !== 'undefined' && window.localStorage) {
      getPropsDynamic(localStorage.getItem("uid") ?? 0).then((repo: any) => {
        setIdentifiedUser(repo?.data);
      });
    }
  }, []);
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
              isGutterBottom={true}
              text="Product Management"
            />
            <FormProvider {...form}>
              <ControlledTabs
                value={valueChange}
                handleChange={handleChange}
                tabsinject={[
                  {
                    label: "Create Product",
                  },
                  {
                    label: "Product List",
                  },
                ]}
              >
                {valueChange == 0 ? (
                  <>
                    <Container
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <ControlledTypography
                        variant="h6"
                        isGutterBottom={true}
                        text="Product Basic Details"
                      />
                      <hr />

                      <ProductManagementForm />
                      <ControlledTypography
                        variant="h6"
                        isGutterBottom={true}
                        text="Product Pricing"
                        style={{ marginTop: "10px" }}
                      />
                      <hr />
                      <ProductPricingForm />
                      <ControlledTypography
                        variant="h6"
                        isGutterBottom={true}
                        text="Product Repository"
                        style={{ marginTop: "10px" }}
                      />
                      <hr />
                      <ProductResourceForm />
                      <NormalButton
                        style={{
                          float: "right",
                          marginTop: "10px",
                          marginBottom: "10px",
                        }}
                        variant="outlined"
                        size="small"
                        children={"SAVE"}
                        onClick={handleContinue}
                        disabled={!isValid}
                      />
                    </Container>
                  </>
                ) : (
                  <>
                    <Container>
                      <UncontrolledCard
                        style={{
                          marginTop: "10px",
                        }}
                      >
                        <Typography variant="subtitle1">
                          Product List
                        </Typography>
                        <ProjectTable
                              data={pmlist}
                              sx={{
                                marginTop: "20px",
                                overflowX: "scroll",
                                width: "100%",
                              }}
                              columns={PMGridColumns}
                              rowIsCreativeDesign={false} loading={false}                        />
                      </UncontrolledCard>
                    </Container>
                  </>
                )}
              </ControlledTabs>
              <ControlledBackdrop open={open} />
            </FormProvider>
          </UncontrolledCard>
        </Container>
      )}
    </>
  );
};


export default ProductManagement;
