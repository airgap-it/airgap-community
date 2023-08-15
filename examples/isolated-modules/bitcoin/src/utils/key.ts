import {
  ExtendedPublicKey,
  ExtendedSecretKey,
  newExtendedPublicKey,
  newExtendedSecretKey,
  newPublicKey,
  newSecretKey,
  PublicKey,
  SecretKey
} from '@airgap/module-kit'
import { ExcludeTyped, ExtractTyped } from '@airgap/module-kit/types/meta/utility-types'
import bs58check from 'bs58check'

import {
  BitcoinExtendedPublicKeyEncoding,
  BitcoinExtendedSecretKeyEncoding,
  BitcoinSegwitExtendedPublicKeyEncoding,
  BitcoinSegwitExtendedSecretKeyEncoding
} from '../types/key'

const EXT_SK_PREFIX: Record<BitcoinExtendedSecretKeyEncoding, string> = {
  xprv: '0488ade4'
}

const EXT_SK_SEGWIT_PREFIX: Record<BitcoinSegwitExtendedSecretKeyEncoding, string> = {
  xprv: '0488ade4',
  yprv: '049d7878',
  zprv: '04b2430c'
}

export type ExtendedSecretKeyEncoding = keyof typeof EXT_SK_PREFIX | keyof typeof EXT_SK_SEGWIT_PREFIX
const extendedSecretKeyPrefixes: Record<string, string>[] = [EXT_SK_PREFIX, EXT_SK_SEGWIT_PREFIX]
const extendedSecretKeyEncodings: string[] = createEncodings(extendedSecretKeyPrefixes)

const EXT_PK_PREFIX: Record<BitcoinExtendedPublicKeyEncoding, string> = {
  xpub: '0488b21e'
}

const EXT_PK_SEGWIT_PREFIX: Record<BitcoinSegwitExtendedPublicKeyEncoding, string> = {
  xpub: '0488b21e',
  ypub: '049d7cb2',
  zpub: '04b24746'
}

export type ExtendedPublicKeyEncoding = keyof typeof EXT_PK_PREFIX | keyof typeof EXT_PK_SEGWIT_PREFIX
const extendedPublicKeyPrefixes: Record<string, string>[] = [EXT_PK_PREFIX, EXT_PK_SEGWIT_PREFIX]
const extendedPublicKeyEncodings: string[] = createEncodings(extendedPublicKeyPrefixes)

export function convertSecretKey(secretKey: SecretKey, targetFormat: SecretKey['format']): SecretKey {
  if (secretKey.format === targetFormat) {
    return secretKey
  }

  switch (secretKey.format) {
    case 'encoded':
      throw new Error(`Unsupported secret key format ${secretKey.format}.`)
    case 'hex':
      return newSecretKey(convertHexSecretKey(secretKey.value, targetFormat))
    default:
      throw new Error('Unuspported secret key format.')
  }
}

function convertHexSecretKey(secretKey: string, targetFormat: SecretKey['format']): string {
  if (targetFormat === 'hex') {
    return secretKey
  }

  throw new Error(`Unsupported secret key format ${targetFormat}.`)
}

type ConvertExtendedSecretKeyTarget =
  | {
      format: ExcludeTyped<ExtendedSecretKey['format'], 'encoded'>
    }
  | {
      format: ExtractTyped<ExtendedSecretKey['format'], 'encoded'>
      type: ExtendedSecretKeyEncoding
    }

export function convertExtendedSecretKey(extendedSecretKey: ExtendedSecretKey, target: ConvertExtendedSecretKeyTarget): ExtendedSecretKey {
  switch (extendedSecretKey.format) {
    case 'encoded':
      return newExtendedSecretKey(convertEncodedExtendedSecretKey(extendedSecretKey.value, target))
    case 'hex':
      return newExtendedSecretKey(convertHexExtendedSecretKey(extendedSecretKey.value, target))
    default:
      throw new Error('Unuspported extended secret key format.')
  }
}

function convertEncodedExtendedSecretKey(extendedSecretKey: string, target: ConvertExtendedSecretKeyTarget): string {
  if (target.format === 'encoded' && extendedSecretKey.startsWith(target.type)) {
    return extendedSecretKey
  }

  switch (target.format) {
    case 'encoded':
      const hexExtendedSecretKey: string = convertEncodedExtendedSecretKey(extendedSecretKey, { format: 'hex' })

      return convertHexExtendedSecretKey(hexExtendedSecretKey, target)
    case 'hex':
      const convertedExtendedPublicKey: string | undefined = convertKeyEncodedToHex(
        extendedSecretKey,
        extendedSecretKeyEncodings,
        recognizeExtendedSecretKeyEncoding
      )
      if (convertedExtendedPublicKey === undefined) {
        throw new Error('Unsupported encoded extended secret key.')
      }

      return convertedExtendedPublicKey
    default:
      throw new Error('Unsupported extended secret key format.')
  }
}

function convertHexExtendedSecretKey(extendedSecretKey: string, target: ConvertExtendedSecretKeyTarget): string {
  if (target.format === 'hex') {
    return extendedSecretKey
  }

  return convertKeyHexToEncoded(extendedSecretKey, target.type, recognizeExtendedSecretKeyEncoding)
}

function recognizeExtendedSecretKeyEncoding(type: string): Record<string, string> {
  const encoding: Record<string, string> | undefined = recognizeExtendedKeyEncoding(type, extendedSecretKeyPrefixes)
  if (encoding === undefined) {
    throw new Error('Unsupported extended secret key encoding,')
  }

  return encoding
}

export function convertPublicKey(publicKey: PublicKey, targetFormat: PublicKey['format']): PublicKey {
  if (publicKey.format === targetFormat) {
    return publicKey
  }

  switch (publicKey.format) {
    case 'encoded':
      throw new Error(`Unsupported public key format ${publicKey.format}.`)
    case 'hex':
      return newPublicKey(convertHexPublicKey(publicKey.value, targetFormat))
    default:
      throw new Error('Unuspported public key format.')
  }
}

function convertHexPublicKey(pk: string, targetFormat: PublicKey['format']): string {
  if (targetFormat === 'hex') {
    return pk
  }

  throw new Error(`Unsupported public key format ${targetFormat}.`)
}

type ConvertExtendedPublicKeyTarget =
  | {
      format: ExcludeTyped<ExtendedPublicKey['format'], 'encoded'>
    }
  | {
      format: ExtractTyped<ExtendedPublicKey['format'], 'encoded'>
      type: ExtendedPublicKeyEncoding
    }

export function convertExtendedPublicKey(extendedPublicKey: ExtendedPublicKey, target: ConvertExtendedPublicKeyTarget): ExtendedPublicKey {
  switch (extendedPublicKey.format) {
    case 'encoded':
      return newExtendedPublicKey(convertEncodedExtendedPublicKey(extendedPublicKey.value, target))
    case 'hex':
      return newExtendedPublicKey(convertHexExtendedPublicKey(extendedPublicKey.value, target))
    default:
      throw new Error('Unuspported extended public key format.')
  }
}

function convertEncodedExtendedPublicKey(extendedPublicKey: string, target: ConvertExtendedPublicKeyTarget): string {
  if (target.format === 'encoded' && extendedPublicKey.startsWith(target.type)) {
    return extendedPublicKey
  }

  switch (target.format) {
    case 'encoded':
      const hexExtendedPublicKey: string = convertEncodedExtendedPublicKey(extendedPublicKey, { format: 'hex' })

      return convertHexExtendedPublicKey(hexExtendedPublicKey, target)
    case 'hex':
      const convertedExtendedPublicKey: string | undefined = convertKeyEncodedToHex(
        extendedPublicKey,
        extendedPublicKeyEncodings,
        recognizeExtendedPublicKeyEncoding
      )
      if (convertedExtendedPublicKey === undefined) {
        throw new Error('Unsupported encoded extended public key.')
      }

      return convertedExtendedPublicKey
    default:
      throw new Error('Unsupported extended public key format.')
  }
}

function convertHexExtendedPublicKey(extendedPublicKey: string, target: ConvertExtendedPublicKeyTarget): string {
  if (target.format === 'hex') {
    return extendedPublicKey
  }

  return convertKeyHexToEncoded(extendedPublicKey, target.type, recognizeExtendedPublicKeyEncoding)
}

function recognizeExtendedPublicKeyEncoding(type: string): Record<string, string> {
  const encoding: Record<string, string> | undefined = recognizeExtendedKeyEncoding(type, extendedPublicKeyPrefixes)
  if (encoding === undefined) {
    throw new Error('Unsupported extended public key encoding,')
  }

  return encoding
}

function convertKeyEncodedToHex(
  key: string,
  encodings: string[],
  recognizeEncoding: (type: string) => Record<string, string>
): string | undefined {
  const prefix: string | undefined = encodings.find((prefix: string) => key.startsWith(prefix))
  if (prefix === undefined) {
    return undefined
  }
  const encoding: Record<string, string> = recognizeEncoding(prefix)
  const prefixBytes: number = Buffer.from(encoding[prefix], 'hex').length

  return Buffer.from(bs58check.decode(key).slice(prefixBytes)).toString('hex')
}

function convertKeyHexToEncoded(
  key: string,
  type: string,
  recognizeEncoding: (type: string) => Record<string, string>
) {
  const encoding: Record<string, string> = recognizeEncoding(type)
  const prefix: string = encoding[type]

  return bs58check.encode(Buffer.concat([Buffer.from(prefix, 'hex'), Buffer.from(key, 'hex')]))
}

function createEncodings(prefixes: Record<string, string>[]): string[] {
  return prefixes.reduce((acc, next) => acc.concat(Object.keys(next)), [] as string[])
}

function recognizeExtendedKeyEncoding(type: string, candidates: Record<string, string>[]): Record<string, string> | undefined {
  return candidates.find((candidate: Record<string, string>) => Object.keys(candidate).includes(type))
}
