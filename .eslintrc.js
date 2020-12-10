{
    "_from": "@eslint/eslintrc@^0.1.3",
    "_id": "@eslint/eslintrc@0.1.3",
    "_inBundle": false,
    "_integrity": "sha512-4YVwPkANLeNtRjMekzux1ci8hIaH5eGKktGqR0d3LWsKNn5B2X/1Z6Trxy7jQXl9EBGE6Yj02O+t09FMeRllaA==",
    "_location": "/eslint/@eslint/eslintrc",
    "_phantomChildren": {},
    "_requested": {
      "type": "range",
      "registry": true,
      "raw": "@eslint/eslintrc@^0.1.3",
      "name": "@eslint/eslintrc",
      "escapedName": "@eslint%2feslintrc",
      "scope": "@eslint",
      "rawSpec": "^0.1.3",
      "saveSpec": null,
      "fetchSpec": "^0.1.3"
    },
    "_requiredBy": [
      "/eslint"
    ],
    "_resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-0.1.3.tgz",
    "_shasum": "7d1a2b2358552cc04834c0979bd4275362e37085",
    "_spec": "@eslint/eslintrc@^0.1.3",
    "_where": "C:\\Users\\rufio\\AppData\\Roaming\\npm\\node_modules\\eslint",
    "author": {
      "name": "Nicholas C. Zakas"
    },
    "bugs": {
      "url": "https://github.com/eslint/eslintrc/issues"
    },
    "bundleDependencies": false,
    "dependencies": {
      "ajv": "^6.12.4",
      "debug": "^4.1.1",
      "espree": "^7.3.0",
      "globals": "^12.1.0",
      "ignore": "^4.0.6",
      "import-fresh": "^3.2.1",
      "js-yaml": "^3.13.1",
      "lodash": "^4.17.19",
      "minimatch": "^3.0.4",
      "strip-json-comments": "^3.1.1"
    },
    "deprecated": false,
    "description": "The legacy ESLintRC config file format for ESLint",
    "devDependencies": {
      "chai": "^4.2.0",
      "eslint": "^7.7.0",
      "eslint-config-eslint": "^6.0.0",
      "eslint-plugin-jsdoc": "^22.1.0",
      "eslint-plugin-node": "^11.1.0",
      "eslint-release": "^3.1.2",
      "mocha": "^8.1.1"
    },
    "engines": {
      "node": "^10.12.0 || >=12.0.0"
    },
    "files": [
      "lib",
      "conf",
      "LICENSE"
    ],
    "homepage": "https://github.com/eslint/eslintrc#readme",
    "globals": {
        "supertest": true,
        "expect": true
      },
    "keywords": [
      "ESLint",
      "ESLintRC",
      "Configuration"
    ],
    "license": "MIT",
    "main": "lib/index.js",
    "name": "@eslint/eslintrc",
    "publishConfig": {
      "access": "public"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/eslint/eslintrc.git"
    },
    "scripts": {
      "generate-alpharelease": "eslint-generate-prerelease alpha",
      "generate-betarelease": "eslint-generate-prerelease beta",
      "generate-rcrelease": "eslint-generate-prerelease rc",
      "generate-release": "eslint-generate-release",
      "lint": "eslint .",
      "publish-release": "eslint-publish-release",
      "test": "mocha tests/lib/shared"
    },
    "version": "0.1.3"
  }