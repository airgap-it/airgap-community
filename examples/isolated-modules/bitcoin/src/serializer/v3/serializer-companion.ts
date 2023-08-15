import { AirGapV3SerializerCompanion, SignedTransaction, UnsignedTransaction } from '@airgap/module-kit'
import { V3SchemaConfiguration } from '@airgap/module-kit/types/serializer'
import { IACMessageType, SchemaRoot, TransactionSignRequest, TransactionSignResponse } from '@airgap/serializer'

import { ProtocolIdentifier } from '../../types/protocol'
import {
  BitcoinSegwitSignedTransaction,
  BitcoinSegwitUnsignedTransaction,
  BitcoinSignedTransaction,
  BitcoinUnsignedTransaction
} from '../../types/transaction'

import {
  bitcoinSegwitSignedTransactionToResponse,
  bitcoinSegwitTransactionSignRequestToUnsigned,
  bitcoinSegwitTransactionSignResponseToSigned,
  bitcoinSegwitUnsignedTransactionToRequest,
  bitcoinSignedTransactionToResponse,
  bitcoinTransactionSignRequestToUnsigned,
  bitcoinTransactionSignResponseToSigned,
  bitcoinUnsignedTransactionToRequest
} from './schemas/converter/transaction-converter'
import { BitcoinTransactionSignResponse } from './schemas/definitions/transaction-sign-response-bitcoin'
import { BitcoinTransactionValidator } from './validators/transaction-validator'

const bitcoinTransactionSignRequest: SchemaRoot = require('./schemas/generated/transaction-sign-request-bitcoin.json')
const bitcoinTransactionSignResponse: SchemaRoot = require('./schemas/generated/transaction-sign-response-bitcoin.json')

const bitcoinSegwitTransactionSignRequest: SchemaRoot = require('./schemas/generated/transaction-sign-request-bitcoin-segwit.json')
const bitcoinSegwitTransactionSignResponse: SchemaRoot = require('./schemas/generated/transaction-sign-response-bitcoin-segwit.json')

export class BitcoinV3SerializerCompanion implements AirGapV3SerializerCompanion {
  public readonly schemas: V3SchemaConfiguration[] = [
    {
      type: IACMessageType.TransactionSignRequest,
      schema: { schema: bitcoinTransactionSignRequest },
      protocolIdentifier: ProtocolIdentifier.BTC
    },
    {
      type: IACMessageType.TransactionSignResponse,
      schema: { schema: bitcoinTransactionSignResponse },
      protocolIdentifier: ProtocolIdentifier.BTC
    },
    {
      type: IACMessageType.TransactionSignRequest,
      schema: { schema: bitcoinSegwitTransactionSignRequest },
      protocolIdentifier: ProtocolIdentifier.BTC_SEGWIT
    },
    {
      type: IACMessageType.TransactionSignResponse,
      schema: { schema: bitcoinSegwitTransactionSignResponse },
      protocolIdentifier: ProtocolIdentifier.BTC_SEGWIT
    }
  ]

  private readonly bitcoinTransactionValidator: BitcoinTransactionValidator = new BitcoinTransactionValidator()

  public async toTransactionSignRequest(
    identifier: string,
    unsignedTransaction: UnsignedTransaction,
    publicKey: string,
    callbackUrl?: string
  ): Promise<TransactionSignRequest> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        return bitcoinUnsignedTransactionToRequest(unsignedTransaction as BitcoinUnsignedTransaction, publicKey, callbackUrl)
      case ProtocolIdentifier.BTC_SEGWIT:
        return bitcoinSegwitUnsignedTransactionToRequest(unsignedTransaction as BitcoinSegwitUnsignedTransaction, publicKey, callbackUrl)
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }

  public async fromTransactionSignRequest(
    identifier: string,
    transactionSignRequest: TransactionSignRequest
  ): Promise<UnsignedTransaction> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        return bitcoinTransactionSignRequestToUnsigned(transactionSignRequest)
      case ProtocolIdentifier.BTC_SEGWIT:
        return bitcoinSegwitTransactionSignRequestToUnsigned(transactionSignRequest)
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }

  public async validateTransactionSignRequest(identifier: string, transactionSignRequest: TransactionSignRequest): Promise<boolean> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        try {
          await this.bitcoinTransactionValidator.validateUnsignedTransaction(transactionSignRequest)

          return true
        } catch {
          return false
        }
      case ProtocolIdentifier.BTC_SEGWIT:
        return true
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }

  public async toTransactionSignResponse(
    identifier: string,
    signedTransaction: SignedTransaction,
    accountIdentifier: string
  ): Promise<TransactionSignResponse> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        return bitcoinSignedTransactionToResponse(signedTransaction as BitcoinSignedTransaction, accountIdentifier)
      case ProtocolIdentifier.BTC_SEGWIT:
        return bitcoinSegwitSignedTransactionToResponse(signedTransaction as BitcoinSegwitSignedTransaction, accountIdentifier)
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }

  public async fromTransactionSignResponse(
    identifier: string,
    transactionSignResponse: TransactionSignResponse
  ): Promise<SignedTransaction> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        return bitcoinTransactionSignResponseToSigned(transactionSignResponse as BitcoinTransactionSignResponse)
      case ProtocolIdentifier.BTC_SEGWIT:
        return bitcoinSegwitTransactionSignResponseToSigned(transactionSignResponse as BitcoinTransactionSignResponse)
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }

  public async validateTransactionSignResponse(identifier: string, transactionSignResponse: TransactionSignResponse): Promise<boolean> {
    switch (identifier) {
      case ProtocolIdentifier.BTC:
        try {
          await this.bitcoinTransactionValidator.validateSignedTransaction(transactionSignResponse as BitcoinTransactionSignResponse)

          return true
        } catch {
          return false
        }
      case ProtocolIdentifier.BTC_SEGWIT:
        return true
      default:
        throw new Error(`Protocol ${identifier} not supported`)
    }
  }
}
