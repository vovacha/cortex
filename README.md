## General info

The repository is a desktop application serving as a manager for multiple wallets and automation for EVM-based chains.

Techs: TypeScript, Rust, Tauri, React, React Query, Tailwind CSS, AWS Cognito, IOTA Stronghold Keystore, Ankr, Infura, Ethers.js.

Features currently available:

- Registration and authentication facilitated via AWS Cognito.
- Management of accounts and wallets, including the capability to import/export private keys.
- Integration with centralized exchanges (CEX), granting access to account and sub-account tokens, balances, and withdrawals (OKX integration has been finalized).

Upcoming:

- Integration with Binance.
- Enablement of token transfers from non-custodial wallets.
- Finalization of the integration of IOTA Stronghold Keystore for storing private keys and signing transactions. Progress has been made, but completion of the work is pending.

<img src="https://raw.githubusercontent.com/vovacha/cortex/main/ui.png" alt="UI example">

## How to build the app

Prerequisites: ensure that Rust, Node, and Yarn are installed, and an AWS Cognito Pool has been created.

Rename `example.env` to `.env` and provide values for all the variables.

Install the dependencies:

`yarn install`

Build and run a development version:

`yarn tauri:dev`
