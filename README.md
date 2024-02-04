## General info

The repository is a desktop application serving as a manager for multiple wallets and automation for EVM-based chains.

Techs: TypeScript, Rust, Tauri, React, React Query, Tailwind CSS, AWS Cognito, IOTA Stronghold Keystore, Ankr, Infura, Ethers.js.

Features currently available:

- Registration and authentication through AWS Cognito.
- Account and wallet management, allowing the import/export of private keys.
- Centralized exchange (CEX) integration, enabling access to account and sub-account tokens, balances, and withdrawals (OKX integration is complete).

To be implemented:

- Integration of Binance.
- Token transfers from non-custodial wallets.
- Completion of the IOTA Stronghold Keystore integration for storing private keys and signing transactions. Some progress has been made, but the work remains unfinished.

## How to build the app

Prerequisites: Ensure that Rust, Node, and Yarn are installed, and an AWS Cognito Pool has been created.

Rename `example.env` to `.env` and provide values for all the variables.

Install the dependencies:
`yarn install`

Build and run a development version:
`yarn tauri:dev`
