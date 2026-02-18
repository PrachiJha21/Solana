# Scholarly (Campus dApp) - Security Hardened

A decentralized campus hub for suggestions, notes, requests and discussion hub on Solana.

## Architecture
```
[Frontend (React)] <-> [Solana (Anchor Program)]
       |                      |
[IPFS (Pinata)]        [PDA-based State]
```

## Security Implementation

### 🛡️ On-Chain Guardrails
- **Deterministic PDAs**: All accounts use strict seed derivation (author + unique key) to prevent account spoofing.
- **Input Validation**: Enforced length checks for titles (3-120), descriptions (10-1000), and subjects.
- **Anti-Spam Fee**: Each suggestion and request costs 0.00001 SOL (10k lamports) sent to a treasury PDA.
- **Access Control**: Handlers strictly validate signers and re-derive PDA bumps.
- **Events**: `SuggestionCreated`, `NoteUploaded`, and `RequestCreated` events emitted for off-chain indexing and auditing.

### 🌐 Frontend Security
- **CSP (Content Security Policy)**: Strict headers to prevent XSS and unauthorized connections.
- **Transaction Safety**: 
  - Priority fees (Compute Budget) added to all transactions.
  - Simulation check before broadcasting to prevent failed transactions.
- **Sanitization**: Input fields strictly validated before submission.
- **Wallet Handling**: `autoConnect` disabled by default for better user privacy.

### 📦 Storage Security
- **IPFS Integration**: Files stored on IPFS, only CIDs stored on-chain.
- **SIWS (Sign-In with Solana)**: Stub implemented for backend verification of wallet identity.

## Setup Instructions

### Anchor Smart Contract
1. Install Rust, Solana CLI, and Anchor.
2. `cd programs`
3. `anchor build`
4. `anchor deploy --provider.cluster devnet`

### Frontend
1. `npm install`
2. `npm run dev`
3. Connect Phantom wallet on Devnet.

## Submission Checklist
- [x] Public repository
- [x] On-chain program deployed to Devnet
- [x] Input validation on both client and program
- [x] Anti-spam fees implemented
- [x] Security README documentation
