import { useState } from 'react'
import { useNavigate, useParams, NavLink } from 'react-router-dom'
import { message } from '@tauri-apps/api/dialog'
import classNames from 'classnames'

import logo from '../../images/logo.png'
import { useConfirmSignUpMut } from '../../services/queries'

export function ConfirmSignUp (): JSX.Element {
  const { username } = useParams()
  const navigate = useNavigate()
  const confirmSignUp = useConfirmSignUpMut()
  const [code, setCode] = useState('')

  const executeConfirmSignUp = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (username === undefined) {
      navigate(-1)
      return
    }

    confirmSignUp.mutate({ username, code }, {
      onSuccess: async () => {
        await message('E-mail was successfully confirmed')
        navigate({ pathname: '/signin' })
      }
    })
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-16 w-auto" src={logo} alt="Cortex"></img>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Confirm e-mail
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={ (e) => { void executeConfirmSignUp(e) }}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="code" className="block text-sm font-medium leading-6 text-white">
                  Code
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="code"
                  name="code"
                  type="text"
                  autoComplete="current-code"
                  required
                  value={code}
                  onChange={(e) => { setCode(e.target.value) }}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {(confirmSignUp.error !== null)
              ? (
                <p className="mt-2 text-sm text-red-600">
                  {confirmSignUp.error?.message}
                </p>
                )
              : null
            }

            <div>
              <button
                disabled={confirmSignUp.isLoading}
                type="submit"
                className={classNames({
                  'flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500': true,
                  'disabled:opacity-75': confirmSignUp.isLoading
                })}
              >
                Confirm
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-400">
            <NavLink to="/signup" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
              Back
            </NavLink>
          </p>
        </div>
      </div>
    </>
  )
}
