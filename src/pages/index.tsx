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
import { useApiCallBack } from "@/utils/hooks/useApi";
import HomeHeroSection from "@/components/Content/Home/HeroSection";
import HomeFeatureSection from "@/components/Content/Home/FeatureSection";
import HomeFooterSection from "@/components/Content/Home/FooterSection";
import HomeFeatureSectionSecondLayer from "@/components/Content/Home/FeatureSectionSecondLayer";
import { useRefreshTokenHandler } from "@/utils/hooks/useRefreshTokenHandler";
import { useQuery } from "react-query";
import { ControlledBackdrop } from "@/components";
import { useAuthContext } from "@/utils/context/base/AuthContext";
import { SessionContextMigrate } from "@/utils/context/base/SessionContext";

const Home: React.FC = () => {
  useRefreshTokenHandler();
  const UAMCheckAcc = useApiCallBack(
    async (api, randomNumber: Number) =>
      await api.users.UAMCheckAccounts(randomNumber)
  );
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setIsHidden } = useContext(ARContext) as ContextSetup;
  const { accessSavedAuth, accessUserId } = useContext(
    SessionContextMigrate
  ) as SessionStorageContextSetup;
  const { checkAuthentication } = useAuthContext();
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
  const { data, isLoading, error } = useQuery("checkUser", () =>
    UAMCheckAcc.execute(1).then((response: any) => response.data)
  );
  useEffect(() => {
    if (data == "not_exist") {
      setIsHidden(true);
      router.push("/create-account");
    } else {
    }
  }, [data, isLoading, error]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  useEffect(() => {
    checkAuthentication("home");
  }, [accessSavedAuth, accessUserId]);
  return (
    <>
      {loading && <ControlledBackdrop open={loading} />}
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
    </>
  );
};

export default Home;
