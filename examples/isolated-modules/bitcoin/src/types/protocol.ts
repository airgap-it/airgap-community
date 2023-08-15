import { ProtocolNetwork } from '@airgap/module-kit'

export enum ProtocolIdentifier {
  BTC = "dev_btc",
  BTC_SEGWIT = "dev_btc_segwit"
}

export type BitcoinUnits = 'BTC' | 'mBTC' | 'Satoshi'

interface BitcoinBaseProtocolNetwork extends ProtocolNetwork {
  indexerApi: string
}

export interface BitcoinStandardProtocolNetwork extends BitcoinBaseProtocolNetwork {
  type: 'mainnet' | 'testnet'
}
export interface BitcoinCustomProtocolNetwork extends BitcoinBaseProtocolNetwork {
  type: 'custom'
  bitcoinjsNetworkName: string
}

export type BitcoinProtocolNetwork = BitcoinStandardProtocolNetwork | BitcoinCustomProtocolNetwork

export interface BitcoinProtocolOptions {
  network: BitcoinProtocolNetwork
}
