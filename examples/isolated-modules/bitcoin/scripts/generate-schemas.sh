#!/bin/bash

node_modules/.bin/ts-json-schema-generator --path 'src/serializer/v3/schemas/definitions/transaction-sign-response-bitcoin-segwit.ts' --tsconfig 'tsconfig.json' -c > src/serializer/v3/schemas/generated/transaction-sign-response-bitcoin-segwit.json
node_modules/.bin/ts-json-schema-generator --path 'src/serializer/v3/schemas/definitions/transaction-sign-response-bitcoin.ts' --tsconfig 'tsconfig.json' -c > src/serializer/v3/schemas/generated/transaction-sign-response-bitcoin.json
node_modules/.bin/ts-json-schema-generator --path 'src/serializer/v3/schemas/definitions/transaction-sign-request-bitcoin-segwit.ts' --tsconfig 'tsconfig.json' -c > src/serializer/v3/schemas/generated/transaction-sign-request-bitcoin-segwit.json
node_modules/.bin/ts-json-schema-generator --path 'src/v1/serializer/v3/schemas/definitions/transaction-sign-request-bitcoin.ts' --tsconfig 'tsconfig.json' -c > src/serializer/v3/schemas/generated/transaction-sign-request-bitcoin.json
