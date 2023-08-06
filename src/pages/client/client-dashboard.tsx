import { useState, useEffect, useContext } from "react";
import {
  ControlledBackdrop,
  ControlledGrid,
  UncontrolledCard,
  ControlledTypography,
} from "@/components";
import { useRouter } from "next/router";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { PageProps } from "@/utils/types";
import { GetServerSideProps } from "next";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { useToastContext } from "@/utils/context/base/ToastContext";
import { useReferences } from "@/utils/context/hooks/hooks";
import { NormalButton } from "@/components/Button/NormalButton";
import { ControlledPopoverButton } from "@/components/Button/PopoverButton";

const ClientDashboard: React.FC = () => {
  const { signoutProcess, tokenExpired, TrackTokenMovement, expirationTime, AlertTracker, FormatExpiry, refreshTokenBeingCalled, isMouseMoved, isKeyPressed,
    accessToken, disableRefreshTokenCalled } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [references, setReferences] = useReferences()
    const router = useRouter()
    const { handleOnToast } = useToastContext()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined
    useEffect(() => {
      setLoading(false)
    }, [])
    const handleClosePopover = () => {
      setAnchorEl(null)
    }
    // useEffect(() => {
    //   if(!accessToken || accessToken == undefined) {
    //     router.push('/login')
    //     setTimeout(() => {
    //       setLoading(false)
    //     }, 2000)
    //   } else {
    //     setLoading(false)
    //       const isExpired = TrackTokenMovement()
    //       if(isExpired) {
    //         signoutProcess()
    //         handleOnToast(
    //           "Token expired. Please re-login.",
    //           "top-right",
    //           false,
    //           true,
    //           true,
    //           true,
    //           undefined,
    //           "dark",
    //           "error"
    //         );
    //       }
    //   }
    // }, [tokenExpired]);
    // useEffect(() => {
    //   if(!disableRefreshTokenCalled) {
    //     if(isMouseMoved) {
    //       refreshTokenBeingCalled()
    //     }
    //   }
    // }, [isMouseMoved, disableRefreshTokenCalled])
    // useEffect(() => {
    //   if(!disableRefreshTokenCalled) {
    //     if(isKeyPressed){
    //       refreshTokenBeingCalled()
    //     }
    //   }
    // }, [isKeyPressed, disableRefreshTokenCalled])
    return (
        <>
            {loading ? (
                <ControlledBackdrop open={loading} />
            ) : (
                <Container>
                  {/* {
                    expirationTime != null && expirationTime <= 30 * 1000 &&
                    AlertTracker(
                      `You are idle. Token expires in: ${FormatExpiry(expirationTime)}`, "error"
                    )
                  } */}
                  <UncontrolledCard style={{
                    padding: '20px'
                  }} elevation={5}>
                    <ControlledGrid>
                      <Grid item xs={6}>
                        <Typography variant="h5" sx={{
                          fontWeight: 'bold'
                        }}>
                          Welcome Back, {references?.firstname}
                        </Typography>
                        <Typography
                        variant="caption"
                        >
                          We're very happy to see you on your personal dashboard.
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <div style={{
                          display: 'flex'
                        }}>
                          <NormalButton 
                          size="small"
                          variant="outlined"
                          children="View Purchases"
                          sx={{
                            color: '#9B718D',
                            border: '1px solid #DBCCCB'
                          }}
                          /> &nbsp;&nbsp;
                          <button
                            className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#973B74",
                              width: "150px",
                            }}
                          >
                            Order Now
                          </button>
                        </div>
                      </Grid>
                    </ControlledGrid>
                    
                  </UncontrolledCard>
                  <ControlledGrid>
                      <Grid item xs={4}>
                        <UncontrolledCard>
                        <Grid container alignItems="center">
                          <Grid item xs>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#932262'}}>
                            System Installment Progress
                          </Typography>
                          </Grid>
                          <Grid item>
                          
                          <ControlledPopoverButton
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            handleClosePopOver={handleClosePopover}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            handleShowPopOver={(e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}
                          >
                            <Typography variant="caption">Test</Typography>
                          </ControlledPopoverButton>
                          </Grid>
                        </Grid>
                        </UncontrolledCard>
                      </Grid>
                      <Grid item xs={4}>
                        <UncontrolledCard>
                        <Grid container alignItems="center" sx={{ padding: '5px'}}>
                          <Grid item xs>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#932262'}}>
                            Maintained Systems
                          </Typography>
                          </Grid>
                          <Grid item>
                          <NormalButton 
                          variant="text"
                          sx={{
                            color: '#9B718D'
                          }}
                          size="small"
                          children="View All"
                          />
                          </Grid>
                        </Grid>
                        </UncontrolledCard>
                      </Grid>
                      <Grid item xs={4}>
                        <UncontrolledCard>
                          {/* to be improved.. */}
                          <div style={{ display: 'flex'}}>
                            <Typography gutterBottom variant='overline' sx={{
                              fontWeight: 'bold',
                              color: '#9B718D',
                              mr: 2,
                              ml: 1
                            }}>
                              Wishlist Products
                            </Typography>
                            <Divider orientation="vertical" flexItem />
                            <Typography variant='overline' sx={{
                              fontWeight: 'bold',
                              color: '#9B718D',
                              ml: 2
                            }}>
                              Bought Products
                            </Typography>
                          </div>
                        </UncontrolledCard>
                        <UncontrolledCard style={{ marginTop: '10px'}}>
                          <Typography variant='h6'
                          // sx={{ fontWeight: 'bold'}}
                          >
                            Buy 2 Systems Get 1% Off
                          </Typography>
                          <Typography sx={{
                            color: '#715766'
                          }} variant='caption'>
                            Hurry this is a limited offer until July 31 only!
                          </Typography>
                          <Grid sx={{ mt: 3}} container alignItems="center">
                            <Grid item xs>
                            <button
                            className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            style={{
                              cursor: "pointer",
                              backgroundColor: "#973B74",
                              width: "150px",
                            }}
                          >
                            Buy Now
                          </button>
                            </Grid>
                            <Grid item>
                              
                            </Grid>
                          </Grid>
                        </UncontrolledCard>
                      </Grid>
                    </ControlledGrid>
                </Container>
            )}
        </>
    )
}

export default ClientDashboard