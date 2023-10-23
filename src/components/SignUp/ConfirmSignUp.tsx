import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { message } from '@tauri-apps/api/dialog'
import logo from '../../images/logo.png'
import { useAuth } from '../../hooks/useAuth'

export function ConfirmSignUp (): JSX.Element {
  const auth = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const executeConfirmSignUp = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const result = await auth.confirmSignUp(code)
    if (result.success === true) {
      await message('E-mail was successfully confirmed')
      navigate({ pathname: '/signin' })
    } else {
      await message(result.message)
    }
  }
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src={logo} alt="Concierge"></img>
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
                  type="code"
                  autoComplete="current-code"
                  required
                  value={code}
                  onChange={(e) => { setCode(e.target.value) }}
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
