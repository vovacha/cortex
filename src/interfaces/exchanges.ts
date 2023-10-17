export enum Exchanges {
  OKX,
  Binance,
}

export interface ApiKey {
  id: string
  name: string
  apiKey: string
  secretKey: string
  passphrase: string
  exchange: Exchanges
}

export interface ApiKeysState {
  keys: ApiKey[]
}

export interface BaseApiKey {
  name: string
  apiKey: string
  secretKey: string
  passphrase: string
  exchange: Exchanges
}
