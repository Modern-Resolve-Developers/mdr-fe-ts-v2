import { ControlledTextField } from "@/components/TextField/TextField";
import { Grid, IconButton, Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/TaskManagement/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { useAtom } from "jotai";
import { useActiveStepTask } from "../useActiveStep";
import { ControlledSelectField } from "@/components/SelectField";

import { useApiCallBack } from "@/utils/hooks/useApi";
import {
  taskAssigneeAtom,
  taskInformationAtom,
} from "@/utils/hooks/useAccountAdditionValues";
import ControlledGrid from "@/components/Grid/Grid";

import { CreateTask } from "@/pages/api/types";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

const taskAssigneeBaseSchema = z.object({
  assignee: requiredString("Please select assignee."),
  reporter: requiredString("Please select reporter."),
  task_dept: requiredString("Please select task department."),
  task_status: requiredString("Please provide status."),
});

export type TaskAssigneeCreation = z.infer<typeof taskAssigneeBaseSchema>;

const TaskAssigneeForm = () => {
  const FetchUsersBasedType = useApiCallBack((api, usertype: any) =>
    api.mdr.fetchUsersBasedType(usertype)
  );
  const [assignee, setAssignee] = useState<
    Array<{ name: string; label: string; value: string }>
  >([]);
  const [reporter, setReporter] = useState<
    Array<{ name: string; label: string; value: string }>
  >([
    {
      name: "JM",
      label: "JM",
      value: "jm",
    },
  ]);
  const [department, setDepartment] = useState<
    Array<{ name: string; label: string; value: string }>
  >([
    {
      name: "SQE",
      label: "SQE",
      value: "sqe",
    },
  ]);

  const [status, setStatus] = useState<
    Array<{
      name: string;
      label: string;
      value: string;
    }>
  >([
    {
      name: "Active",
      label: "Active",
      value: "1",
    },
    {
      name: "Inactive",
      label: "Inactive",
      value: "0",
    },
  ]);
  const { control } = useFormContext<TaskAssigneeCreation>();
  useEffect(() => {
    FetchUsersBasedType.execute("2").then((repo: any) => {
      const { data }: any = repo;
      setAssignee([
        ...assignee,
        {
          name: data[0]?.firstname,
          label: data[0]?.firstname,
          value: data[0]?.id,
        },
      ]);
    });
  }, []);

  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="assignee"
            options={assignee}
            label="Assignee"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="reporter"
            options={reporter}
            label="Reporter"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="task_dept"
            options={department}
            label="Department"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledSelectField
            control={control}
            name="task_status"
            options={status}
            label="Task Status"
            required
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};

export const TaskAssigneeDetailsForm = () => {
  const [taskAssigneeDetailsAtom, setTaskAssigneeDetailsAtom] =
    useAtom(taskAssigneeAtom);
  const [taskInformationDetailsAtom, setTaskInformationDetailsAtom] =
    useAtom(taskInformationAtom);
  const [open, setOpen] = useState(false);
  const form = useForm<TaskAssigneeCreation>({
    resolver: zodResolver(taskAssigneeBaseSchema),
    mode: "all",
    defaultValues: taskAssigneeDetailsAtom,
  });
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const CreateTaskApi = useApiCallBack(async (api, args: CreateTask) => {
    var result = await api.mdr.createTask(args);
    return result;
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const { next } = useActiveStepTask();
  const handleContinue = () => {
    handleSubmit((values) => {
      const create_task_request = {
        title: taskInformationDetailsAtom?.title,
        description: taskInformationDetailsAtom?.description,
        imgurl: "None",
        priority: taskInformationDetailsAtom?.priority,
        subtask: JSON.stringify(taskInformationDetailsAtom?.subtask),
        assignee_userid: values.assignee,
        reporter: values.reporter,
        task_dept: values.task_dept,
        task_status: values.task_status,
        created_by: "Administrator",
      };
      setOpen(!open);
      CreateTaskApi.execute(create_task_request).then((repository: any) => {
        const { data }: any = repository;
        if (data == "task_created") {
          handleOnToast(
            "Successfully added",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
          setTaskAssigneeDetailsAtom(values);
          next();
        }
      });
    })();
    return false;
  };
  return (
    <FormProvider {...form}>
      <TaskAssigneeForm />
      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
      ></BottomButtonGroup>
      <ControlledBackdrop open={open} />
    </FormProvider>
  );
};
