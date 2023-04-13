import { ControlledTextField } from "@/components/TextField/TextField";
import { FieldProps } from "@/pages/hooks/useLayout"
import { ToastContextSetup } from "@/utils/context";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { useContext, useEffect, useState } from "react";
import GoogleButton from 'react-google-button'

const AccountLoginBlocks: React.FC<FieldProps> = (props: FieldProps) => {
    const {
        control,
        handleSubmit,
        enterKeyLogin,
        isValid,
        getValues,
        setValue
    } = props;
    const {
      handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const [checkedVal, setCheckedVal] = useState(false)
    const checkRememberMe = () => {
      let parseStorage;
      const storage = localStorage.getItem('rm')
      if(typeof storage == 'string'){
        parseStorage = JSON.parse(storage)
      }
      setValue('email', parseStorage?.email)
      setCheckedVal(parseStorage?.rmChecked)
    }
    useEffect(() => {
      checkRememberMe()
    }, [])    

    const handleCheckBox = (event: any) => {
      const checked = event.target.checked
      const value = getValues()
      if(checked){
        if(!value.email){
          handleOnToast(
            "Provide required fields",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "error"
          )
        } else{
          const objCredentials = {
            email : value.email,
            rmChecked: checked
          }
          localStorage.setItem("rm", JSON.stringify(objCredentials))
          setCheckedVal(checked)
        }
      } else {
        setCheckedVal(false)
        localStorage.removeItem('rm')
      }
    }
    return (
        <>
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="/mdr.png"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                start creating your account
              </a>
            </p>
          </div>
          <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <ControlledTextField 
                        control={control}
                        name="email"
                        required
                        label="Email"
                        />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <ControlledTextField 
                        control={control}
                        name="password"
                        required
                        type="password"
                        label="Password"
                        onKeyPress={enterKeyLogin}
                        />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={handleCheckBox}
                  checked={checkedVal}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                disabled={!isValid} onClick={handleSubmit}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Sign in
              </button>
              <GoogleButton
                            // onClick={() => loginWithGoogle()}
                            style={{width: '100%', marginTop: '20px'}}
                            disabled={true}
                        />
            </div>
          </div>
        </div>
      </div>
        </>
    )
}

export default AccountLoginBlocks