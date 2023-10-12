import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Input, Select } from '../../../shared-components'
import { createApiKey } from '../../../store/api-keys/store'
import { Exchanges } from '../../../types'
import { enumKeys } from '../../../utils'

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateApiKeyModal ({ setOpenModal }: Props): JSX.Element {
  const [apiKey, setApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [name, setName] = useState('')
  const [exchange, setExchange] = useState(Exchanges.OKX)
  const dispatch = useDispatch()

  function getOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    enumKeys(Exchanges).forEach((val) => {
      options.push(<option value={val}>{Exchanges[Number(val)]}</option>)
    })
    return options
  }

  function apiKeyCreate (): void {
    if (exchange !== null) {
      dispatch(createApiKey({ apiKey, secretKey, passphrase, name, exchange }))
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
