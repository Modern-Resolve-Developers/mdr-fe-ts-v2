import DashboardLayout from "@/components/DashboardLayout";
import { Container } from "@mui/material";
import { ControlledTypography, UncontrolledCard } from "@/components";
import { sidebarList, sidebarExpand } from "../../utils/sys-routing/sys-routing";
import { useLayout } from "../../utils/pageHooks/hooks/useLayout";
const ProductManagement: React.FC = () => {
    
    return (
        <>
            <DashboardLayout
            sidebarConfig={sidebarList}
            subsidebarConfig={sidebarExpand}
            >
                <Container>
                    <UncontrolledCard>
                        <ControlledTypography 
                        variant='h6'
                        isGutterBottom={true}
                        text='Product Management'
                        />
                    {
                        useLayout(
                            {},
                            ['ProductManagementBlocks']
                        )
                    }
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
        </>
    )
}

export default ProductManagement