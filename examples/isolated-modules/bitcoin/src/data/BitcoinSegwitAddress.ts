import type * as bitcoin from 'bitcoinjs-lib'

export class BitcoinSegwitAddress {
  private constructor(protected readonly value: string) {}

  public static fromBip32(bip32: bitcoin.BIP32Interface): BitcoinSegwitAddress {
    return new BitcoinSegwitAddress(bip32.toBase58())
  }

  public static fromPayment(payment: bitcoin.Payment): BitcoinSegwitAddress {
    if (payment.address === undefined) {
      throw new Error('Could not generate address.')
    }

    return new BitcoinSegwitAddress(payment.address)
  }

  public asString(): string {
    return this.value
  }
}
