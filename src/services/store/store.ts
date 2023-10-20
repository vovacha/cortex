import { Store } from 'tauri-plugin-store-api'
import { v4 as uuidv4 } from 'uuid'
import type { Account, Group, Wallet, ApiKey, HasId } from '../../interfaces'

// TODO: implement singleton factory method
export abstract class BaseStore<T extends HasId> {
  public readonly listKey
  public readonly store

  constructor (listKey: string) {
    this.listKey = listKey
    this.store = new Store('concierge_db.dat')
  }

  public async get (id: string): Promise<T> {
    const obj: T | null = await this.store.get(id)
    if (obj === null) {
      throw new Error(`Object with id ${id} not found`)
    } else {
      return obj
    }
  }

  public async getAll (): Promise<T[]> {
    const objects: string[] = await this.store.get(this.listKey) ?? []
    const toBeFetched = []
    for (const obj of objects) {
      toBeFetched.push(this.store.get(obj))
    }
    return await Promise.all<any>(toBeFetched).then(values => values.filter(v => v))
  }

  public async create (data: Partial<T>): Promise<T> {
    const id = uuidv4()
    data.id = id
    const obj = ({ ...data } as unknown) as T
    await Promise.all([this.store.set(id, obj), this.addToList(id)])
    return obj
  }

  public async delete (id: string): Promise<string> {
    await Promise.all([this.store.delete(id), this.deleteFromList(id)])
    return id
  }

  public async update (data: Partial<T> & HasId): Promise<T> {
    let obj: T = await this.get(data.id)
    obj = { ...obj, ...data }
    await this.store.set(obj.id, obj)
    return obj
  }

  public async deleteAll (): Promise<void> {
    const objects: string[] = await this.store.get(this.listKey) ?? []
    const toBeDeleted = []
    for (const obj of objects) {
      toBeDeleted.push(this.store.delete(obj))
    }
    toBeDeleted.push(this.store.delete(this.listKey))
    await Promise.all(toBeDeleted)
  }

  private async addToList (id: string): Promise<void> {
    const objects: string[] = await this.store.get(this.listKey) ?? []
    objects.push(id)
    await this.store.set(this.listKey, objects)
  }

  private async deleteFromList (id: string): Promise<void> {
    let objects: string[] = await this.store.get(this.listKey) ?? []
    objects = objects.filter(objId => objId !== id)
    await this.store.set(this.listKey, objects)
  }
}

class AccountStore extends BaseStore <Account> { }
class AccountGroupStore extends BaseStore <Group> { }
class WalletStore extends BaseStore <Wallet> { }
class ApiKeyStore extends BaseStore <ApiKey> { }

export const accountStore = new AccountStore('accounts')
export const accountGroupStore = new AccountGroupStore('accountGroups')
export const walletStore = new WalletStore('wallets')
export const apiKeyStore = new ApiKeyStore('apiKeys')
