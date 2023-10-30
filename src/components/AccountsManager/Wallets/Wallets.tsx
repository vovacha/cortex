import { useEffect, useState } from 'react'
import {
  PlusSmallIcon, ArrowUpOnSquareStackIcon, ArrowDownOnSquareStackIcon, Squares2X2Icon
} from '@heroicons/react/24/outline'

import { Modal, Button, Header, TableHead, EmptyData, Checkbox, InputEdit } from '@/shared-components'
import { accountManagerMenu as menu } from '@/routes'
import { useGetWallets, useCreateWalletMut, useUpdateWalletMut, useDeleteWalletMut } from '@/services/queries'
import type { HasName, Wallet } from '@/interfaces'

import { readWalletsFromFile } from './readWalletsFromFile'
import GenerateWalletsModal from './GenerateWalletsModal'
import { savePrivateKeysToFile } from './savePrivateKeysToFile'

export function Wallets (): JSX.Element {
  // Modal states
  const [genWalletsModal, setGenWalletsModal] = useState(false)
  // Selected checkboxes states
  const [selectedWallets, setSelectedWallets] = useState<boolean[]>([])
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const [isAnySelected, setIsAnySelected] = useState(false)
  // In-place edit names state
  const [walletNames, setWalletNames] = useState<string[]>([])
  // Fetchers
  const getWallets = useGetWallets()
  // Mutations
  const createWallet = useCreateWalletMut()
  const updateWallet = useUpdateWalletMut()
  const deleteWallet = useDeleteWalletMut()

  const wallets = getWallets.data ?? []
  const isLoading = wallets.length === selectedWallets.length &&
    wallets.length === walletNames.length

  useEffect(() => {
    if (getWallets.isLoading === false && getWallets.data !== undefined) {
      setWalletNames(getWallets.data.map((w) => w.name))
      setSelectedWallets(getWallets.data.map(() => false))
      setIsSelectedAll(false)
    }
  }, [getWallets.data, getWallets.isLoading])

  useEffect(() => {
    selectedWallets.includes(true) ? setIsAnySelected(true) : setIsAnySelected(false)
  }, [selectedWallets])

  async function importPrivateKeys (): Promise<void> {
    for (const wallet of await readWalletsFromFile()) {
      await createWallet.mutateAsync(wallet as Partial<Wallet> & HasName)
    }
  }

  async function selectedDeleteOnClick (): Promise<void> {
    for (let i = 0; i < selectedWallets.length; i++) {
      if (selectedWallets[i]) {
        deleteWallet.mutate(wallets[i].id)
        selectedWallets[i] = false
      }
    }
  }

  const tableRows = (): JSX.Element[] => wallets.map((wallet, i) => (
    <tr className='group odd:bg-gray-900 even:bg-slate-900 hover:bg-slate-800' key={i}>
      <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
        <Checkbox index={i} name='wallet-checkbox' isChecked={selectedWallets[i]}
          onChange={() => {
            // TODO: can we make it O(1) instead of O(N)
            setSelectedWallets(selectedWallets.map((checked, j) => j === i ? !checked : checked))
          }}/>
      </td>
      <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{i + 1}</td>
      <td className='group relative whitespace-nowrap px-2 py-2 text-sm text-gray-300'>
        <InputEdit index={i} name='wallet-name' value={walletNames[i]}
          onChange={(name) => {
            setWalletNames(walletNames.map((oldName, j) => j === i ? name : oldName))
          }}
          onBlur={ (name = walletNames[i]) => { void updateWallet.mutateAsync({ ...wallet, name }) }} />
      </td>
      <td className='group relative whitespace-nowrap px-2 py-2 text-sm text-gray-300'>
        {wallet.address}
      </td>
    </tr>
  ))

  const selectAllCheckbox = <Checkbox index={0} name='checkbox-all'
    isChecked={isSelectedAll} onChange={() => {
      isSelectedAll
        ? setSelectedWallets(selectedWallets.map(() => false))
        : setSelectedWallets(selectedWallets.map(() => true))
      setIsSelectedAll(!isSelectedAll)
    }}/>

  return (<>
    <Header menu={menu}/>
    <div className='bg-gray-900 px-4 sm:px-6 lg:px-8'>
      <div className='mt-8 flow-root'>
        <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
            {wallets.length > 0
              ? (
              <table className='min-w-full divide-y divide-gray-700'>
                <TableHead columns={[selectAllCheckbox, 'Name', 'Wallet Address']}/>
                <tbody className='divide-y divide-gray-800'>{(isLoading) ? tableRows() : null}</tbody>
              </table>
                )
              : <EmptyData title='No Wallets' message='Get started by creating a new Wallet'/>}
          </div>
        </div>
      </div>
    </div>
    <Modal showModal={genWalletsModal} setShowModal={setGenWalletsModal} Content={ GenerateWalletsModal } />
    <div className='fixed bottom-0 p-2 pl-5'>
      <Button onClick={() => { setGenWalletsModal(true) }}
        text={ <><PlusSmallIcon className='inline h-4 w-4' aria-hidden='true' /> Generate</>} />
      <Button onClick={() => { void importPrivateKeys() }} type='secondary'
        text={ <><ArrowDownOnSquareStackIcon className='inline h-4 w-4' aria-hidden='true' /> Import</>} />
      <Button onClick= {() => { void savePrivateKeysToFile(wallets) }} type='secondary'
        text={ <><ArrowUpOnSquareStackIcon className='inline h-4 w-4' aria-hidden='true' /> Export</>} />
      <Button disabled={!isAnySelected} onClick={() => { void selectedDeleteOnClick() }} type='danger'
        text={ <><Squares2X2Icon className='inline h-4 w-4' aria-hidden='true' /> Delete</>} />
    </div>
    </>
  )
}
