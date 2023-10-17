import { useState } from 'react'
import { Button, Input, Select } from '../../../shared-components'
import { Exchanges } from '../../../interfaces'
import { enumKeys } from '../../../utils'
import { useCreateApiKeyMut } from '../../../services/queries'

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateApiKeyModal ({ setOpenModal }: Props): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [name, setName] = useState('')
  const [exchange, setExchange] = useState(Exchanges.OKX)
  const createApiKey = useCreateApiKeyMut()

  function getOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    enumKeys(Exchanges).forEach((val) => {
      options.push(<option value={val}>{Exchanges[Number(val)]}</option>)
    })
    return options
  }

  function apiKeyCreate (): void {
    if (exchange !== null) {
      createApiKey.mutate({ apiKey, secretKey, passphrase, name, exchange })
      setOpenModal(false)
    }
  }
  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <Select name='Exchange' value={exchange} options={getOptions()} setter={setExchange} />
    <Input name='Name' value={name} setter={setName} />
    <Input name='API key' value={apiKey} setter={setApiKey} />
    <Input name='Secret Key' value={secretKey} setter={setSecretKey} />
    <Input name='Passphrase' value={passphrase} setter={setPassphrase} />
    <div className='sm:col-span-3'>
      <Button onClick={() => { apiKeyCreate() }} text='Add API Key' />
    </div>
  </div>
  </>
}
