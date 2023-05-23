import React from 'react';
import { useRouter } from 'next/router';

type ContactUsProps = {
  children: React.ReactNode;
};
const ContactUs: React.FC<ContactUsProps> = ({ children }) => {
  const Router = useRouter();
  return (
    <div className="mx-4">
      <div className="px-4 pt-8">
        <h2 className="cursor-pointer text-black-400">
          <a onClick={() => Router.push('/')}>
            <span aria-hidden="true">&larr;</span> Home
          </a>
        </h2>
      </div>
      <div className="flex justify-center items-center h-0 w-full p-0">
        <img
          className="w-[305px] pt-11 top-1"
          src="drlogo.png"
          alt="Digital Resolve logo"
        />
      </div>
      <div className="flex gap-6 py-1  mt-0  md:mt-[90px] flex-col md:flex-row md:py-20">
        {children}
      </div>
    </div>
  );
};

export default ContactUs;
