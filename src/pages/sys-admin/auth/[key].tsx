import { ControlledBackdrop } from "@/components"
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { PageProps } from "@/utils/types"
import { useAuthContext } from "@/utils/context/base/AuthContext"
import { useToastContext } from "@/utils/context/base/ToastContext"
import { useAccessToken } from "@/utils/context/hooks/hooks"

const DashboardAuth: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const { signoutProcess, tokenExpired, TrackTokenMovement, accessToken } = useAuthContext();
    const { handleOnToast } = useToastContext()
    const router = useRouter()
    useEffect(() => {
        const isExpired = TrackTokenMovement()
        if(!accessToken || accessToken == undefined) {
            router.push('/login')
        } else {
            if(isExpired) {
                setLoading(false)
                signoutProcess("expired")
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
                } else {
                    setLoading(false)
                    router.push('/sys-admin/admin-dashboard')
                }
        }
    }, [tokenExpired, accessToken])
    return (
        <>
            {loading && <ControlledBackdrop open={loading} />}
        </>
    )
}

export default DashboardAuth