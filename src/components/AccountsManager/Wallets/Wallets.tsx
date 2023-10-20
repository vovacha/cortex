import { useState } from 'react'
import { Modal, Button, Header } from '../../../shared-components'
import GenerateWalletsModal from './GenerateWalletsModal'
import { accountManagerMenu as menu } from '../../../routes'
import { useGetWallets, useCreateWalletMut, useDeleteWalletMut } from '../../../services/queries'
import { readWalletsFromFile } from './readWalletsFromFile'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'

export function Wallets (): JSX.Element {
  const [openModal, setOpenModal] = useState(false)
  const { data: wallets, error } = useGetWallets()
  const createWallet = useCreateWalletMut()
  const deleteWallet = useDeleteWalletMut()

  // TODO: handle loading and exceptions properly
  if (wallets === undefined) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

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
                        <thead>
                          <tr>
                            <th scope='col' className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'>
                              #
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              Wallet address
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {wallets.map((wallet, i) => (
                            <tr key={wallet.address}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='group relative whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <p className='absolute visible group-hover:invisible'>{wallet.address}</p>
                                <div className=''>
                                  <PencilSquareIcon onClick={() => { }} className='inline text-white hover:cursor-not-allowed invisible group-hover:visible h-4 w-4 shrink-0' aria-hidden='true' />
                                  <TrashIcon onClick={() => { deleteWallet.mutate(wallet.id) }} className='inline ml-3 text-rose-600 hover:cursor-pointer invisible group-hover:visible h-4 w-4 shrink-0' aria-hidden='true' />
                                </div>
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
    <Modal openModal={openModal} setOpenModal={setOpenModal} Content={ GenerateWalletsModal } />
    <div className="fixed bottom-0 p-6">
      <Button
      onClick={
        () => {
          void (async () => {
            for (const wallet of await readWalletsFromFile()) {
              await createWallet.mutateAsync(wallet)
            }
          })()
        }
      }
      text='Import private keys' />
      <Button onClick={() => { setOpenModal(true) }} text='Generate wallets' />
    </div>
    </>
  )
}
