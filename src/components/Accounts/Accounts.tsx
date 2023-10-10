import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import type { RootState } from '../../store/store'
import { Button } from '../../shared-components/Button'
import { Header } from '../../shared-components/Header'
import { Modal } from '../../shared-components/Modal'
import CreateAccountsModal from './CreateAccountsModal'
import EditAccountModal from './EditAccountModal'
import type { HeaderMenuItem, Account } from '../../types'
import { clearAccounts } from '../../store/accounts/store'
import { clearWallets } from '../../store/wallets/store'
import { useAuth } from '../../hooks/useAuth'

const menu: HeaderMenuItem[] = [
  { name: 'Accounts', href: '/accounts' },
  { name: 'EVM Wallets', href: '/wallets' }
]

export default function Accounts (): JSX.Element {
  const [addAccountModal, setAddAccountModal] = useState(false)
  const [editAccountModal, setEditAccountModal] = useState<Account | undefined>()
  const auth = useAuth()
  const accounts = useSelector((state: RootState) => state.accounts).accounts
  const dispatch = useDispatch()

  function clear (): void {
    dispatch(clearAccounts())
    dispatch(clearWallets())
  }

  return (<>
    <Header menu={menu}/>
    <main className='lg:pr-96'>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {(accounts.length > 0)
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        <thead>
                          <tr>
                            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                              #
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Name
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              EVM Wallet
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Starknet Wallet
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {accounts.map((account, i) => (
                            <tr key={i}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.name}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{account.evmWallet ?? '-'}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>-</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <a className='cursor-pointer' onClick={() => { setEditAccountModal(account) }}>
                                  <PencilSquareIcon className='h-6 w-6 shrink-0' aria-hidden='true' />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        )
                      : null}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </main>
    <Modal openModal={addAccountModal} setOpenModal={setAddAccountModal} Content={ CreateAccountsModal } />
    <Modal openModal={editAccountModal} setOpenModal={setEditAccountModal} Content={ EditAccountModal } />
    <div className="fixed bottom-0 p-3">
        <Button onClick={() => { setAddAccountModal(true) }} text="Add Accounts" />
        <Button onClick={() => { clear() }} text="Clear All [DEBUG]" bg="bg-rose-600" />
        <Button onClick={ auth.signOut } text="Sign Out [DEBUG]" bg="bg-rose-600" />
    </div>
    </>
  )
}
