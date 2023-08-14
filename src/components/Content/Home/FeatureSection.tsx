import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

export const features = [
  {
    name: "Push to deploy.",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.",
    icon: CloudArrowUpIcon,
    color: "bg-[#153D77]",
    textColor: "text-[#d4d0d0]",
  },
  {
    name: "SSL certificates.",
    description:
      "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
    icon: LockClosedIcon,
    color: "bg-[#D9D9D9]",
    textColor: "text-gray-900",
  },
  {
    name: "Database backups.",
    description:
      "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.",
    icon: ServerIcon,
    color: "bg-[#153D77]",
    textColor: "text-[#d4d0d0]",
  },
];

type HomeFeatureSectionProps = {
  children: React.ReactNode;
};

const HomeFeatureSection: React.FC<HomeFeatureSectionProps> = ({
  children,
}) => {
  return (
    <div className="relative overflow-hidden py-24 sm:py-32 ">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
        <div className="mx-auto max-w-2xl  lg:mx-0 lg:max-w-none flex flex-col justify-center items-center">
          <div className="lg:pr-8 lg:pt-4 w-full flex justify-center">
            <div className="w-full flex justify-center flex-col items-center">
              <h2 className="text-base text-center font-semibold leading-7 text-indigo-600">
                Deploy faster
              </h2>
              <p className="mt-2 text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl">
                A better workflow
              </p>
              <p className="mt-6 w-[500px] text-lg text-center leading-8 text-gray-600">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Maiores impedit perferendis suscipit eaque, iste dolor
                cupiditate blanditiis ratione.
              </p>
              <dl className="mt-10 p-10 w-full justify-center items-center  text-base leading-7 flex flex-col lg:flex-row gap-10 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className={`relative pl-9 p-10 ${feature.color} ${feature.textColor} w-full h-auto lg:h-[250px] rounded-md shadow-lg`}
                  >
                    <dt className="inline font-extrabold  text-gray-900">
                      <feature.icon
                        className={`absolute top-4 left-[50%] translate-x-[-50%] h-5 w-5 ${feature.textColor}`}
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HomeFeatureSection;
