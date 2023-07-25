import { ControlledBackdrop } from "@/components"
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { PageProps } from "@/utils/types"

const DashboardAuth: React.FC<PageProps> = ({data}) => {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        setTimeout(() => {
            if(data?.preloadedAccessLevels == 1) {
                setLoading(false)
                router.push('/sys-admin/admin-dashboard')
            } else {
                setLoading(false)
                router.push('/login')
            }
        }, 3000)
    }, [])
    return (
        <>
            {loading && <ControlledBackdrop open={loading} />}
        </>
    )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
    try {
        const preloadedAccessLevels = await getSecretsIdentifiedAccessLevel(1)
        return { props : { data: { preloadedAccessLevels }}}
    } catch (error) {
        console.log(`Error on get Notification response: ${JSON.stringify(error)} . `)
        return { props : {error}}
    }
}

export default DashboardAuth