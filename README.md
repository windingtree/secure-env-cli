# Secure ENV CLI
CLI for running scripts using encrypted environment variables

## Usage

```bash
yarn add @windingtree/secure-env-cli
yarn link
```

### ENV encryption

```bash
npx senv --encrypt ./path/to/raw/env/file
```

You will be prompted for a password. An encrypted file will be saved on the same path with `.senv` extension.

### Decryption of encrypted file

```bash
senv --decrypt ./path/to/encrypted/file.senv
```

You will be prompted for a password. A decrypted file will be saved on the same path with `.env` extension.

### Command execution

```bash
senv ./path/to/encrypted/file.senv "./path/to/command/or/script --param1 --param2"
```

## Development environment

### Setup

```bash
yarn install
```

### Build

```bash
yarn build
```

### Tests

```bash
yarn test
yarn test:coverage
```

