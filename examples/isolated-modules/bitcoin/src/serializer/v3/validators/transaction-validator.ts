// tslint:disable: max-classes-per-file
import { TransactionValidator, validateSyncScheme } from '@airgap/serializer'
import { async } from 'validate.js'

import { BitcoinTransactionSignRequest } from '../schemas/definitions/transaction-sign-request-bitcoin'
import { BitcoinTransactionSignResponse } from '../schemas/definitions/transaction-sign-response-bitcoin'

const unsignedTransactionConstraints = {
  ins: {
    presence: { allowEmpty: false },
    isValidBitcoinInput: true
  },
  outs: {
    presence: { allowEmpty: false },
    isValidBitcoinOutput: true
  }
}

const signedTransactionConstraints = {
  from: {
    presence: { allowEmpty: false },
    isValidBitcoinFromArray: true
  },
  amount: {
    type: 'BigNumber',
    presence: { allowEmpty: false }
  },
  fee: {
    type: 'BigNumber',
    presence: { allowEmpty: false }
  },
  accountIdentifier: {
    type: 'String',
    presence: { allowEmpty: false }
  },
  transaction: {
    isValidBitcoinTxString: true,
    type: 'String',
    presence: { allowEmpty: false }
  }
}
const success = () => undefined
const error = (errors) => errors

export class BitcoinTransactionValidator implements TransactionValidator {
  public validateUnsignedTransaction(request: BitcoinTransactionSignRequest): Promise<any> {
    const transaction = request.transaction
    validateSyncScheme({})

    return async(transaction, unsignedTransactionConstraints).then(success, error)
  }
  public validateSignedTransaction(response: BitcoinTransactionSignResponse): Promise<any> {
    return async(response, signedTransactionConstraints).then(success, error)
  }
}
