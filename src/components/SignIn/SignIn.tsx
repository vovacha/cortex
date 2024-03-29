import { useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import classNames from 'classnames'

import logo from '../../images/logo.png'
import { useAuth } from '../../hooks/useAuth'
import { useSignInMut } from '../../services/queries'

export function SignIn (): JSX.Element {
  const auth = useAuth()
  const signIn = useSignInMut()
  const navigate = useNavigate()
  const params = useParams()
  const [username, setUsername] = useState(params.username ?? '')
  const [password, setPassword] = useState('')

  const executeSignIn = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    signIn.mutate({ username, password }, {
      onSuccess: () => {
        auth.signIn(username)
        navigate({ pathname: '/accounts-manager/accounts' })
      }
    })
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <img className="mx-auto h-16 w-auto" src={logo} alt="Cortex"/>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={ (e) => { void executeSignIn(e) }}>
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
                  tabIndex={1}
                  required
                  value={username}
                  onChange={(e) => { setUsername(e.target.value) }}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <NavLink to={ `/forgot-password/${username}` } className="font-semibold text-indigo-400 hover:text-indigo-300" tabIndex={4}>
                    Forgot password?
                  </NavLink>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  tabIndex={2}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {(signIn.error !== null)
              ? (
                <p className="mt-2 text-sm text-red-600">
                  {signIn.error?.message}
                </p>
                )
              : null
            }

            <div>
              <button
                disabled={signIn.isLoading}
                tabIndex={3}
                type="submit"
                className={classNames({
                  'flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500': true,
                  'disabled:opacity-75': signIn.isLoading
                })}
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            Not a member?{' '}
            <NavLink to="/signup" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300" tabIndex={5}>
              Register
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}
