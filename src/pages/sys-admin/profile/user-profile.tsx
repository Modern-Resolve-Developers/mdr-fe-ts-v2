import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useEffect, useState, useContext } from "react";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { ControlledBackdrop, ControlledGrid, UncontrolledCard } from "@/components";
import { CardContent, Container, Grid, Typography } from "@mui/material";
import { ProfileCard } from "@/components/Cards/ProfileCard/ProfileCard";
import { NormalButton } from "@/components/Button/NormalButton";
import { useReferences } from "@/utils/context/hooks/hooks";
const UserProfile: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const { checkAuthentication } = useAuthContext()
    const [references, setReferences] = useReferences()
    const { accessSavedAuth, accessUserId } = useContext(
        SessionContextMigrate
    ) as SessionStorageContextSetup;
    useEffect(() => {
        checkAuthentication("admin");
        setTimeout(() => {
        setLoading(false);
        }, 3000);
    }, [accessSavedAuth, accessUserId])
    useEffect(() => {
        console.log(references)
    }, [])
    return (
        <>
            {loading ? (
                <ControlledBackdrop open={loading} />
            ) : (
                <Container>
                    <UncontrolledCard>
                        <Typography variant='body2' gutterBottom>
                            User Profile Management
                        </Typography>
                        <ProfileCard
                            profilePicture="https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*"
                            coverPhoto="https://i.pinimg.com/originals/f2/e2/5f/f2e25fa89ad3e970aeb994db60a81303.jpg"
                            name='JM Sevilla'
                            position="Senior Technical Engineering Lead"
                        >
                            <CardContent>
                                <UncontrolledCard
                                style={{
                                    float: 'right',
                                    marginTop: '10px',
                                    marginBottom: '10px'
                                }}
                                >
                                    <Typography variant='caption'>
                                        Actions
                                    </Typography>
                                    <div style={{
                                        display: 'flex'
                                    }}>
                                        <NormalButton 
                                        variant='outlined'
                                        size='small'
                                        children='Change profile picture'
                                        />&nbsp;
                                        <NormalButton 
                                        variant='outlined'
                                        size='small'
                                        children='Change cover photo'
                                        />
                                    </div>
                                </UncontrolledCard>
                                <ControlledGrid>
                                    <Grid item xs={6}>
                                        <UncontrolledCard>
                                            <Typography variant='caption'>
                                                Basic Information
                                            </Typography>

                                        </UncontrolledCard>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <UncontrolledCard>
                                            <Typography variant='caption'>
                                                Credentials Information
                                            </Typography>
                                        </UncontrolledCard>
                                    </Grid>
                                </ControlledGrid>
                            </CardContent>
                        </ProfileCard>
                    </UncontrolledCard>
                </Container>
            )}
        </>
    );
};

export default UserProfile;
