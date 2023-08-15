import { AirGapModule } from '@airgap/module-kit'
import { BitcoinModule } from './module/BitcoinModule'

export function create(): AirGapModule {
  return new BitcoinModule()
}
