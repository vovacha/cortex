import { Store } from 'tauri-plugin-store-api'
import { v4 as uuidv4 } from 'uuid'
import type { Account, Group, Wallet, ApiKey, HasId, HasName } from '../../interfaces'

const STORE_FILE_NAME = 'cortex_db.dat'
// TODO: implement singleton factory method
export abstract class BaseStore<T extends HasId> {
  public readonly listKey
  public readonly store

  constructor (listKey: string) {
    this.listKey = listKey
    this.store = new Store(STORE_FILE_NAME)
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

  public async create (data: Partial<T> & HasName): Promise<T> {
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

  /**
  * Tracks usage of names in the object namespace.
  * Ex. namespace "accounts". An account named "test" turns into "test-1".
  * The following account called "test" turns into "test-2".
  * Returns a new name with the postfix of times the name was used.
  * @param {string} name
  */
  public async modifyNameWithCount (name: string): Promise<string> {
    const key = `${this.listKey}-${name}`
    const count: number = await this.store.get(key) ?? 0
    await this.store.set(key, count + 1)
    return `${name}-${count + 1}`
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

class AccountStore extends BaseStore <Account> {
  public async create (data: Partial<Account> & HasName): Promise<Account> {
    const name = await this.modifyNameWithCount(data.name)
    return await super.create({ ...data, name })
  }
}
class WalletStore extends BaseStore <Wallet> {
  public async create (data: Partial<Wallet> & HasName): Promise<Wallet> {
    const name = await this.modifyNameWithCount(data.name)
    return await super.create({ ...data, name })
  }
}
class AccountGroupStore extends BaseStore <Group> { }
class ApiKeyStore extends BaseStore <ApiKey> { }

export const accountStore = new AccountStore('accounts')
export const accountGroupStore = new AccountGroupStore('accountGroups')
export const walletStore = new WalletStore('wallets')
export const apiKeyStore = new ApiKeyStore('apiKeys')
