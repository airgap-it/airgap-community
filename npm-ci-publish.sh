#!/bin/bash
echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > .npmrc

git update-index --assume-unchanged npm-ci-publish.sh
git update-index --assume-unchanged npm-ci-publish-beta-only.sh

git --no-pager diff

VERSION=$(node -pe 'JSON.parse(process.argv[1]).every(({ version }) => version.indexOf("beta") !== -1) ? "beta" : "prod"' "$(yarn -s lerna changed --json)")

if [ "$VERSION" = "prod" ]
then
  yarn lerna publish from-package --contents dist --yes
else
  echo "version is beta, using --dist-tag next"
  yarn lerna publish from-package --contents dist --dist-tag next --yes
fi

rm .npmrc