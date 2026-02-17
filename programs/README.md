# Campus dApp Anchor Program

This directory contains the Anchor smart contract for the Campus dApp.

## Prerequisites

1.  **Rust**: Install Rust from [https://rustup.rs/](https://rustup.rs/).
2.  **Solana CLI**: Install Solana CLI from [https://docs.solana.com/cli/install-solana-cli-tools](https://docs.solana.com/cli/install-solana-cli-tools).
3.  **Anchor CLI**: Install Anchor CLI from [https://www.anchor-lang.com/docs/installation](https://www.anchor-lang.com/docs/installation).

## Building

To build the program:

```bash
anchor build
```

## Testing

To run the tests:

```bash
anchor test
```

## Deploying to Devnet

1.  Configure Solana to use Devnet:
    ```bash
    solana config set --url devnet
    ```
2.  Fund your wallet:
    ```bash
    solana airdrop 2
    ```
3.  Build and deploy:
    ```bash
    anchor build
    anchor deploy
    ```
4.  Copy the program ID returned by the deploy command and update `declare_id!` in `src/lib.rs` and `Anchor.toml`.
5.  Build and deploy again to finalize.

## Project Structure

*   `src/lib.rs`: The main smart contract logic.
*   `Cargo.toml`: Rust dependencies.
*   `Anchor.toml`: Anchor configuration.
