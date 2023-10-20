import type { Account, Group, Wallet, ApiKey, HasId } from '../../interfaces'
import { type BaseStore, accountStore, accountGroupStore, walletStore, apiKeyStore } from '../store/store'

// TODO: implement singleton factory method
abstract class BaseStoreAPI<T extends HasId> {
  private readonly store: BaseStore<T>

  constructor (store: BaseStore<T>) {
    this.store = store
  }

  public async get (id: string): Promise<T> {
    return await this.store.get(id)
  }

  public async getAll (): Promise<T[]> {
    return await this.store.getAll()
  }

  public async create (data: Partial<T>): Promise<T> {
    return await this.store.create(data)
  }

  public async delete (id: string): Promise<string> {
    return await this.store.delete(id)
  }

  public async update (obj: Partial<T> & HasId): Promise<T> {
    return await this.store.update(obj)
  }

  public async deleteAll (): Promise<void> {
    await this.store.deleteAll()
  }
}

class AccountStoreAPI extends BaseStoreAPI <Account> { }
class AccountGroupStoreAPI extends BaseStoreAPI <Group> { }
class WalletStoreAPI extends BaseStoreAPI <Wallet> { }
class ApiKeyStoreAPI extends BaseStoreAPI <ApiKey> { }

export const accountStoreAPI = new AccountStoreAPI(accountStore)
export const accountGroupStoreAPI = new AccountGroupStoreAPI(accountGroupStore)
export const walletStoreAPI = new WalletStoreAPI(walletStore)
export const apiKeyStoreAPI = new ApiKeyStoreAPI(apiKeyStore)
