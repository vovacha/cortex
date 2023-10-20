import { useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Button, Header, Modal } from '../../../shared-components'
import { settingsMenu as menu } from '../../../routes'
import { Exchanges as ExchangesEnum } from '../../../interfaces'
import CreateApiKeyModal from './CreateApiKeyModal'
import { useGetApiKeys, useDeleteApiKeysMut } from '../../../services/queries'

export function Exchanges (): JSX.Element {
  const [addApiKeyModal, setAddApiKeyModal] = useState(false)
  const deleteAllApiKeys = useDeleteApiKeysMut()
  const { data: apiKeys, isLoading, error } = useGetApiKeys()

  // TODO: handle loading and exceptions properly
  if (isLoading) { return <h1 color='white'>Loading</h1> }
  if (error instanceof Error) { return <h1 color='white'>{error.message}</h1> }

  const isDevelopment = import.meta.env.VITE_DEVELOPMENT === 'true'
  return (<>
    <Header menu={menu}/>
    <main className=''>
      <div className='bg-gray-900'>
        <div className='mx-auto max-w-7xl'>
            <div className='px-4 sm:px-6 lg:px-8'>
              <div className='mt-8 flow-root'>
                <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                  <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                    {(Array.isArray(apiKeys) && apiKeys.length > 0)
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
                              Exchange
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                              API Key
                            </th>
                            <th scope='col' className='px-3 py-3.5 text-left text-sm font-semibold text-white'>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-800'>
                          {apiKeys.map((key, i) => (
                            <tr key={i}>
                              <td className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>{i + 1}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{key.name}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{ExchangesEnum[key.exchange]}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>{key.apiKey}</td>
                              <td className='whitespace-nowrap px-3 py-2 text-sm text-gray-300'>
                                <a className='cursor-pointer' onClick={() => { }}>
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
    <Modal openModal={addApiKeyModal} setOpenModal={setAddApiKeyModal} Content={ CreateApiKeyModal } />
    <div className="fixed bottom-0 p-6">
        <Button onClick={() => { setAddApiKeyModal(true) }} text="Add API Key" />
        {(isDevelopment)
          ? <Button onClick={() => { deleteAllApiKeys.mutate() }} text="Clear API Keys" type="danger" />
          : null
        }
    </div>
    </>
  )
}
