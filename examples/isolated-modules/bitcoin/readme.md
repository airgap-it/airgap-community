# AirGap Isolated Module Example - Bitcoin

This is an example of an Isolated Module based on the official [`@airgap/bitcoin`](https://github.com/airgap-it/airgap-coin-lib/tree/master/packages/bitcoin) pacakge.

## Build & Pack

1. Install dependencies.
```bash
$ npm install
```

2. Compile the source code and create a bundle.
```bash
$ npm run build
```

The `build` script compiles the TypeScript sources and places the output in the `dir` folder, copying the serializer schemas along. Next, it uses [Browserify](https://browserify.org/) to bundle the compiled code and its dependencies, ensuring that the module can run independently when placed within an isolated execution environment. The script takes the compiled entrypoint file `./dist/index.js` and transforms it into `./module/iso-example-bitcoin.js`. The script uses the `--standalone bitcoin` flag, which creates a global `bitcoin` namespace for the module's sources.

Additionally, the script populates the `module` folder with a `manifest.json` file generated from `manifest.template.json`.

*Note: [Browserify](https://browserify.org/) serves as an example of a bundler, but other similar tools are also suitable as long as they generate a bundle compatible with the supported [execution environments](https://github.com/airgap-it/airgap-community/blob/main/packages/isolated-modules/readme.md#execution-environments).*

3. Copy the symbol asset.
```bash
$ cp ./assets/devbtc.svg ./module/devbtc.svg
```

4. Generate a key pair to be used for creating a [signature](https://github.com/airgap-it/airgap-community/blob/main/packages/isolated-modules/readme.md#signature) for the module.
```bash
$ npm run generate-keypair
```

The `generate-keypair` script uses [@stablelib/ed25519](https://github.com/StableLib/stablelib/tree/master/packages/ed25519) to generate an Ed25519 key pair and saves it in the `keypair.json` file.

5. Complete the data in the `module/manifest.json` file.

- set the author:
```json
"author": "YOUR NAME"
```

- copy the public key value from the key pair generated in the previous step and place it under the `publicKey` name:
```json
"publicKey": "COPY THE PUBLIC KEY FROM `keypair.json`" /* eg. "0x48c07feff824c7ecbbdc5442f6a57408ed5a779c153e3dca7f52d676b8e0b517" */
```

- configure the module to use the global namespace which was created during the bundling process:
```json
"src": {
  "namespace": "bitcoin"
}
```

- specify the image asset for the main unit symbol defined by the protocol (the example Bitcoin protocol [uses `DEVBTC`](https://github.com/airgap-it/airgap-community/blob/main/examples/isolated-modules/bitcoin/src/protocol/BitcoinProtocol.ts#L122) instead of `BTC`):
```json
"res": {
  "symbol": {
    "DEVBTC": "file://devbtc.svg"
  }
}
```

- list **ALL** sources and assets that the module ships with:
```json
"include": [
  "iso-example-bitcoin.js",
  "devbtc.svg"
]
```
**IMPORTANT: Only files listed in `include` will be used inside the isolated execution environment.**

- configure the environment, if required (read more [here](https://github.com/airgap-it/airgap-community/blob/main/packages/isolated-modules/readme.md#execution-environments)):
```json
"jsenv": {
  "android": "webview"
}
```

<br />
<br />

The complete `module/manifest.json`:

```json
{
  "name": "iso-example-bitcoin",
  "version": "1.0.0",
  "author": "YOUR NAME",
  "description": "This is an example of an AirGap Isolated Module.",
  "publicKey": "COPY THE PUBLIC KEY FROM `keypair.json`",
  "src": {
    "namespace": "bitcoin"
  },
  "res": {
	  "symbol": {
		  "DEVBTC": "file://devbtc.svg"
	  }
  },
  "include": [
      "iso-example-bitcoin.js",
	  "devbtc.svg"
  ],
  "jsenv": {
    "android": "webview"
  }
}
```

6. Sign the module.
```bash
$ npm run sign-module
```

The `sign-module` scripts reads the secret key from the `keypair.json` file and the `include` list from the `module/manifest.json` file. It utilizes the `include` list to determine the files to sign. Finally, it uses [@stablelib/ed25519](https://github.com/StableLib/stablelib/tree/master/packages/ed25519) to sign the module following [the instructions](https://github.com/airgap-it/airgap-community/blob/main/packages/isolated-modules/readme.md#signature) outlined in the documentation.

7. Pack the module.
```bash
$ zip -r iso-example-bitcoin.zip module
```

## Run

### Requirements

The 3rd party Isolated Modules are currently in preview. In order to test them on your device, install the AirGap apps published on `preview/isolated-modules`:

**AirGap Vault**

1. Clone the airgap-vault repository and checkout to `preview/isolated-modules`.
```bash
# HTTPS
$ git clone https://github.com/airgap-it/airgap-vault.git

# SSH
$ git clone git@github.com:airgap-it/airgap-vault.git


$ git checkout preview/isolated-modules
```

2. Build the project.
```bash
$ yarn install
$ yarn build
```

3. Connect a device and run it.
```bash
# Android
$ yarn cap run android

# iOS
$ yarn cap run ios
```

**AirGap Wallet**

1. Clone the airgap-vault repository and checkout to `preview/isolated-modules`.
```bash
# HTTPS
$ git clone https://github.com/airgap-it/airgap-wallet.git

# SSH
$ git clone git@github.com:airgap-it/airgap-wallet.git


$ git checkout preview/isolated-modules
```

2. Build the project.
```bash
$ npm install # optionally, use --legacy-peer-deps if required
$ npm run build
```

3. Connect a device and run it.
```bash
# Android
$ npx cap run android

# iOS
$ npx cap run ios
```

### Install the example Isolated Module

1. Transfer the Isolated Module bundle (the ZIP file generated in the [Build](#build--pack) step) to your device's storage.
2. Open AirGap Vault, navigate to `Settings` > `(Settings) Isolated Modules` and follow the instructions on the screen to load the bundle from the storage.
3. Open AirGap Wallet, navigate to `Settings` > `(Add-ons) Isolated Modules` and follow the instructions on the screen to load the bundle from the storage.
