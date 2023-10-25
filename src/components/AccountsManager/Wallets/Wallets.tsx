import { useState } from 'react'
import { Modal, Button, Header, TableHead } from '../../../shared-components'
import GenerateWalletsModal from './GenerateWalletsModal'
import { accountManagerMenu as menu } from '../../../routes'
import { useGetWallets, useCreateWalletMut } from '../../../services/queries'
import { readWalletsFromFile } from './readWalletsFromFile'
import { savePrivateKeysToFile } from './savePrivateKeysToFile'

export function Wallets (): JSX.Element {
  const [openModal, setOpenModal] = useState(false)
  const wallets = useGetWallets().data ?? []
  const createWallet = useCreateWalletMut()

  async function importPrivateKeys (): Promise<void> {
    for (const wallet of await readWalletsFromFile()) {
      await createWallet.mutateAsync(wallet)
    }
  }

  return (<>
    <Header menu={menu}/>
    <main>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {(wallets.length > 0)
                      ? (
                      <table className='min-w-full divide-y divide-gray-700'>
                        <TableHead columns={['#', 'Wallet Address']}/>
                        <tbody className='divide-y divide-gray-800'>
                          {wallets.map((wallet, i) => (
                            <tr className='odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='group relative whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                {wallet.address}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                        )
                      : null}
                      {/* TODO: use empty table template https://github.com/ConciergeApplication/concierge/issues/22 */}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </main>
    <Modal openModal={openModal} setOpenModal={setOpenModal} Content={ GenerateWalletsModal } />
    <div className="fixed bottom-0 p-6">
      <Button onClick={() => { void importPrivateKeys() }} text='Import private keys' classNames='mr-3 mb-3' />
      <Button onClick= {() => { void savePrivateKeysToFile(wallets) }} text='Export wallets' classNames='mr-3 mb-3' />
      <Button onClick={() => { setOpenModal(true) }} text='Generate wallets' classNames='mr-3 mb-3' />
    </div>
    </>
  )
}
