import { useState } from 'react'
import { Button, Input, SelectNew } from '@/shared-components'
import { Exchanges, type ModalContentProps } from '@/interfaces'
import { enumKeys } from '@/utils'
import { useCreateApiKeyMut } from '@/services/queries'

export default function CreateApiKeyModal ({ onClose }: ModalContentProps): JSX.Element {
  const [form, setForm] = useState({ apiKey: '', secretKey: '', passphrase: '', name: '', exchange: Exchanges.OKX })
  const createApiKey = useCreateApiKeyMut()

  function getOptions (): JSX.Element[] {
    const options: JSX.Element[] = []
    enumKeys(Exchanges).forEach((val) => {
      options.push(<option key={val} value={val}>{Exchanges[Number(val)]}</option>)
    })
    return options
  }

  function apiKeyCreate (): void {
    if (form.exchange !== null) {
      createApiKey.mutate(form)
      onClose()
    }
  }
  return <>
  <div className='grid grid-cols-6 gap-x-6 gap-y-8'>
    <SelectNew label='Exchange' name='exchange' form={form} options={getOptions()} setForm={setForm} />
    <Input label='Name' name='name' form={form} setForm={setForm} />
    <Input label='API key'name='apiKey' form={form} setForm={setForm} />
    <Input label='Secret Key' name='secretKey' form={form} setForm={setForm} />
    <Input label='Passphrase' name='passphrase' form={form} setForm={setForm} />
    <div className='sm:col-span-3'>
      <Button onClick={() => { apiKeyCreate() }} text='Add API Key' />
    </div>
  </div>
  </>
}
