import { useEffect, useContext, useState } from "react";
import { ARContext } from "../utils/context/base/AdminRegistrationContext";
import { ContextSetup, SessionStorageContextSetup } from "@/utils/context";
import { useRouter } from "next/router";
import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi";
import HomeHeroSection from "@/components/Content/Home/HeroSection";
import HomeFeatureSection from "@/components/Content/Home/FeatureSection";
import HomeFooterSection from "@/components/Content/Home/FooterSection";
import HomeFeatureSectionSecondLayer from "@/components/Content/Home/FeatureSectionSecondLayer";
import { useRefreshTokenHandler } from "@/utils/hooks/useRefreshTokenHandler";
import { useMutation, useQuery } from "react-query";
import { ControlledBackdrop } from "@/components";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { GetServerSideProps } from "next";
import { PageProps } from "@/utils/types";
import { workWithAccountSetup, workWithCoolDowns, workWithMigrationRouter } from "@/utils/secrets/secrets_migrate_route";
import { MigrationReceiver, RouteEntity, toBeMigrated } from "@/utils/sys-routing/sys-routing";
import { AxiosError, AxiosResponse } from "axios";
import { useUserId } from "@/utils/context/hooks/hooks";

const Home: React.FC<PageProps> = ({ data }) => {
  
  const [uid] = useUserId()
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setIsHidden } = useContext(ARContext) as ContextSetup;
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { checkAuthentication } = useAuthContext();
  const foundSecuredRouter = useSecureHiddenNetworkApi(
    async (api, id: string | undefined) => await api.secure.sla_begin_work_find_secured_route(id)
  )
  const features = [
    {
      name: "Push to deploy",
      description:
        "Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
      icon: CloudArrowUpIcon,
    },
    {
      name: "SSL certificates",
      description:
        "Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
      icon: LockClosedIcon,
    },
    {
      name: "Simple queues",
      description:
        "Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
      icon: ArrowPathIcon,
    },
    {
      name: "Advanced security",
      description:
        "Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.",
      icon: FingerPrintIcon,
    },
  ];
  const useFoundSecuredRouter = useMutation((id: string | undefined) => 
    foundSecuredRouter.execute(id)
  );
  useEffect(() => {
    if(uid != undefined) {
      useFoundSecuredRouter.mutate(uid, {
        onSuccess: (response: AxiosResponse | undefined) => {
          if(response?.data != 404){
            router.replace(response?.data)
            setTimeout(() => setLoading(false), 2000)
          }
        },
        onError: (error: AxiosError | unknown) => {
          setTimeout(() => setLoading(false), 2000)
        }
      })
    } else {
      if(data?.preloadedAccountSetup){
        router.push('/create-account')
        setTimeout(() => setLoading(false), 2000)
      } 
      setLoading(false)
    }
  }, []);
  return (
    <>
      {loading ? <ControlledBackdrop open={loading} />
      : 
      <>
      <HomeHeroSection />
      <HomeFeatureSection
        children={
          <img
            src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
            alt="Product screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        }
      />
      <HomeFeatureSectionSecondLayer>
        {features.map((feature) => (
          <div key={feature.name} className="relative pl-16">
            <dt className="text-base font-semibold leading-7 text-gray-900">
              <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                <feature.icon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </div>
              {feature.name}
            </dt>
            <dd className="mt-2 text-base leading-7 text-gray-600">
              {feature.description}
            </dd>
          </div>
        ))}
      </HomeFeatureSectionSecondLayer>
      <HomeFooterSection />
      </>}
      
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const loadedObject: MigrationReceiver = {
      JsonRoutes: JSON.stringify(toBeMigrated)
    }
    const preloadedGlobals = await workWithMigrationRouter(loadedObject)
    const preloadedAccountSetup = await workWithAccountSetup()
    const preloadedCooldowns = await workWithCoolDowns()
    return {
      props: {
        data: { 
          preloadedGlobals,
           preloadedAccountSetup,
            preloadedCooldowns }
      }
    }
  } catch (error) {
    console.log(`Error on get migration response: ${JSON.stringify(error)}`)
    return { props : {error}}
  }
}

export default Home;
