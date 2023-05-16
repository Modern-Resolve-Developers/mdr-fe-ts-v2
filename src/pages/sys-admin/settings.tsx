import { ControlledTypography, UncontrolledCard } from "@/components";
import DashboardLayout from "@/components/DashboardLayout";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { sidebarExpand, sidebarList } from "@/utils/sys-routing/sys-routing";
import { Container } from "@mui/material";
import { useContext, useEffect } from "react";


const SettingsManagement: React.FC = () => {
    const { checkAuthentication } = useAuthContext();
    const { accessSavedAuth, accessUserId } = useContext(
        SessionContextMigrate
    ) as SessionStorageContextSetup;
    useEffect(() => {
        checkAuthentication("admin");
    }, [accessSavedAuth, accessUserId])
    return (
        <>
            <DashboardLayout
            sidebarConfig={sidebarList}
            subsidebarConfig={sidebarExpand}
            >
                <Container>
                    <UncontrolledCard>
                        <ControlledTypography 
                        variant="h6"
                        isGutterBottom
                        text="Settings Management"
                        />
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
        </>
    )
}

export default SettingsManagement