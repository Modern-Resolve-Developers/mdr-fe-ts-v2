import { Typography } from "@mui/material";
import NavSection from "./HomeNav";

const HomeHeroSection = () => {
  return (
    <div className="isolate ">
      <NavSection />
      <div
        className="absolute -z-20 top-0 h-screen w-full bg-gradient-to-t from-primary via-ff80b5 to-[#a1366e]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 100%)",
        }}
      ></div>
      <main>
        <div className="relative px-6 lg:px-20 flex flex-col justify-center items-center md:gap-[10rem]  md:flex-row ">
          <div className=" max-w-2xl py-32">
            <div className="hidden sm:mb-8 sm:flex ">
              <div className="relative rounded-full backdrop-blur-sm bg-white/30 py-1 px-3 text-sm leading-6 text-gray-600 shadow-md">
                Announcing our next round of motor accessories.{" "}
                <a href="#" className="font-semibold text-indigo-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <Typography className="text-4xl text-center md:text-left font-bold tracking-tight text-gray-900 md:text-5xl lg:text-8xl">
                Digital Resolve Technologies
              </Typography>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Let's make your business digital.
              </p>
              <div className="mt-10 flex items-center  gap-x-6">
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
                <a
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative py-0 -mt-[120px] lg:py-32 ">
            <div>
              <img
                src="/clientregpic-removebg-preview.png"
                alt=""
                width="500"
                className="animate-bounce"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeHeroSection;
