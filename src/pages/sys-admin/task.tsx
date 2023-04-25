import DashboardLayout from "@/components/DashboardLayout";
import { ControlledTypography, UncontrolledCard } from "@/components";
import { Container, ListItemIcon } from "@mui/material";
import { TaskFormAdditionalDetails } from "@/components/TaskManagement";
import { sidebarList, sidebarExpand } from "../../utils/sys-routing/sys-routing";

const Task: React.FC = () => {
    
    return (
        <>
            <DashboardLayout sidebarConfig={sidebarList} subsidebarConfig={sidebarExpand}>
                <Container>
                    <UncontrolledCard>
                        <ControlledTypography 
                        variant='h6'
                        isGutterBottom
                        text='Task Management > Create Task'
                        />
                        <TaskFormAdditionalDetails />
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
        </>
    )
}

export default Task