import { useEffect, useContext } from "react";
import { ARContext } from '../utils/context/base/AdminRegistrationContext'
import { ContextSetup } from "@/utils/context";
import { useRouter } from 'next/router';
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useApiCallBack } from "@/utils/hooks/useApi";

import { useRefreshTokenHandler } from "@/utils/hooks/useRefreshTokenHandler";
import { useLayout } from "../utils/pageHooks/hooks/useLayout";

const Home: React.FC = () => {
  useRefreshTokenHandler()
  const UAMCheckAcc = useApiCallBack(async (api, randomNumber : Number) => await api.users.UAMCheckAccounts(randomNumber))
  const router = useRouter()
  
  const {
    setIsHidden
  } = useContext(ARContext) as ContextSetup 


  useEffect(() => {
    UAMCheckAcc.execute(1).then((response : any) => {
      const { data } : any = response;
      if(data === "not_exist"){
        setIsHidden(true)
        router.push('/create-account')
      }else{}
    }).catch(error => {
      return;
    })
  }, [])

  return (
    <>
      {
        useLayout(
          {},
          [
            'HomeHeroSection',
            'HomeFeatureSection',
            'HomeFeatureSectionSecondLayer',
            'HomeFooterSection'
          ]
        )
      }
    </>
  )
}

export default Home