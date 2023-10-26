import classNames from 'classnames'
import { useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import logo from '../../images/logo.png'
import { useForgotPasswordRequestMut } from '../../services/queries'

export function ForgotPassword (): JSX.Element {
  const navigate = useNavigate()
  const params = useParams()
  const [username, setUsername] = useState<string>(params.username ?? '')
  const forgotPassword = useForgotPasswordRequestMut()

  const executeForgotPassword = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    forgotPassword.mutate({ username }, {
      onSuccess: () => {
        navigate({ pathname: `/forgot-password-submit/${username}/` })
    }})
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src={logo} alt="Concierge"></img>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Forgot password
          </h2>
          <div className="mt-4 text-white text-sm text-center">
            We'll send verification code to your email.
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={ (e) => { void executeForgotPassword(e) }}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value) }}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {(forgotPassword.error !== null)
              ? (
                <p className="mt-2 text-sm text-red-600">
                  {forgotPassword.error?.message}
                </p>
                )
              : null
            }

            <div>
              <button
                disabled={forgotPassword.isLoading}
                type="submit"
                className={classNames({
                  'flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500': true,
                  'disabled:opacity-75': forgotPassword.isLoading
                })}
              >
                Submit
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            <NavLink to="/signin" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}