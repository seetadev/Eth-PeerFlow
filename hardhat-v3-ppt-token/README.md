# ⚙️ **Hardhat v3 — Smart Contract Infrastructure for Eth PeerFlow**

**Eth PeerFlow** uses **Hardhat v3** as the **core development and deployment framework** for its smart contract infrastructure — powering **medical billing**, **emergency payments**, and **tokenized access** across Ethereum networks.

Hardhat’s modular, developer-friendly design made it possible to **rapidly prototype, test, and verify** ERC-20 tokens (**PPT Token**) and **PyUSD invoice settlement contracts** within a unified workflow. Its integration with Ethereum testnets, modern dev tooling, and automated verification enabled Eth PeerFlow to move from concept to production-ready prototype within days.

---

## 🎥 Demo / Screencast

[View Hardhat v3 Deployment Demo →](https://drive.google.com/drive/u/0/folders/1kp8sITMyy5Ku3cliG-qtONZgY9bg75hC)

[Eth-PeerFlow x Hardhat Comprehensive Demo Video](https://youtu.be/38yzN4IEaec)

---

## 🧠 Core Achievements with Hardhat v3

### ✅ Cross-Chain Orchestration

* Used Hardhat’s network configuration plugins for **Ethereum (Sepolia)**.
* Deployed **PPT ERC-20 Token** and **PyUSD-based invoice manager** across test networks.
* Enabled flexible deployment scripts with Ignition modules for multi-environment use.

### 🧩 Automated Testing & Verification

* Leveraged Hardhat’s **task runner** and **console** for automated contract verification and debugging.
* Comprehensive test coverage for token issuance, invoice logic, and settlement workflows.
* Integrated **Viem** for modern Ethereum interactions.

### 🧠 Front-End Integration

* Connected with **Wagmi**, **RainbowKit**, and **React** to enable decentralized front-end interactions.
* Supported real-time invoice status updates and payer confirmations through smart contract event listeners.

### 🔁 Upgradeable Deployments

* Streamlined deployment of **upgradeable smart contracts** during hackathon iteration.
* Rapid feedback loops between backend (Hardhat) and frontend (Next.js) environments.

---

## 🧱 How It Fits Into Eth PeerFlow

Hardhat v3 serves as the **execution and verification backbone** of Eth PeerFlow’s decentralized system.
It coordinates contract logic between **PyUSD settlements**, **PPT tokenized access**, and **libp2p-powered coordination layers**, ensuring that every transaction, invoice, and disbursement remains transparent, traceable, and fault-tolerant.

By combining **Hardhat’s robust development tooling** with **Py-libp2p networking** and **PyUSD stable payments**, Eth PeerFlow showcases how mission-critical decentralized systems can be built with precision, security, and trust.


## 🔧 Key Features and Highlights

* **Framework:** Hardhat v3 (ESM Modules + Ignition)
* **Libraries:** OpenZeppelin Contracts 5.x, Viem
* **Languages:** Solidity, TypeScript
* **Integrations:** Wagmi + RainbowKit for frontend, Py-libp2p for backend data exchange
* **Verification:** Automated via Hardhat tasks and Etherscan plugins


## PPT-FIL-Token (Hardhat v3)

**PPT-FIL-Token** is an **ERC-20 utility token** with **medical invoice management** capabilities. This project demonstrates token-gated access for dApps and includes a complete medical invoice contract system.

> **🎉 Using Hardhat v3** for improved performance and modern tooling support.

---

## 🚀 Features

* ✅ **ERC-20 Standard** — Fully compatible with wallets and exchanges
* 🔑 **Token Gated Access** — Use PPT to unlock gated features and save medical invoices
* 🏥 **Medical Invoice Management** — Store and retrieve medical invoices with token requirements
* 🌐 **Multi-chain Support** — Deploy on Filecoin, Optimism, Arbitrum, and more
* ⚡ **Hardhat v3** — Modern development environment with ESM support
* 🧪 **Comprehensive Testing** — Full test suite with viem integration

---

## 📂 Project Setup

### 1. Prerequisites

- Node.js 18+
- npm or yarn

### 2. Installation

```bash
# Clone this repository
git clone https://github.com/seetadev/park-pro-token-hardhat-3
cd park-pro-token-hardhat-3

# Install dependencies (use --force for Hardhat v3 compatibility)
npm install --force
```

### 3. Configure Environment

Create a `.env` file in the root directory with the following values:

```env
RPC_URL=""        # RPC endpoint of your target chain
PRIVATE_KEY=""    # Private key of deployer wallet
VERIFY_KEY=""     # Etherscan (or Filfox/Blockscout) API key for contract verification
```

---

## 🛠️ Development Commands

### Compile Contracts
```bash
npx hardhat compile
```

### Run Local Node
```bash
# Start local hardhat node with test accounts
npx hardhat node
```

### Run Tests
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/MedToken.js
```

### Deploy Contracts

```bash
# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet/mainnet
npx hardhat run scripts/deploy.js --network calibnet
npx hardhat run scripts/deploy.js --network op-sepolia
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

## 🏗️ Smart Contracts

### PPTToken.sol
- ERC20 token with 200M initial supply
- Standard OpenZeppelin implementation
- 18 decimal places

### MedInvoiceContract.sol
- Token-gated medical invoice storage
- Subscription-based access model
- File storage and retrieval functions
- Owner-controlled token withdrawal

---

## 🌐 Description of Supported Networks

The PPT Token and Invoice Settlement Contracts are deployed and tested across multiple Ethereum-compatible networks.
See full configuration and supported environments here:
👉 [**Supported Networks (PPT Token)**](https://github.com/seetadev/Eth-PeerFlow/tree/main/hardhat-v3-ppt-token#-supported-networks)

| Network                  | Chain           | Purpose                              |
| ------------------------ | --------------- | ------------------------------------ |
| **Ethereum Sepolia**     | EVM Testnet     | Primary testing and verification     |
| **Filecoin Calibration** | FEVM Testnet    | Data persistence and storage testing |
| **Optimism Sepolia**     | Layer-2 Testnet | Scalable settlements                 |
| **Arbitrum Sepolia**     | Layer-2 Testnet | Fast payment confirmations           |


## 🌐 Supported Networks

The project is configured for multiple networks:

| Network | RPC Endpoint | Chain ID | Type |
|---------|--------------|----------|------|
| Localhost | http://127.0.0.1:8545 | 31337 | Development |
| Filecoin Calibration | https://api.calibration.node.glif.io/rpc/v1 | 314159 | Testnet |
| Filecoin Mainnet | https://api.node.glif.io | 314 | Mainnet |
| Optimism Sepolia | https://sepolia.optimism.io | 11155420 | Testnet |
| Optimism Mainnet | https://mainnet.optimism.io | 10 | Mainnet |
| Arbitrum Sepolia | https://sepolia-rollup.arbitrum.io/rpc | 421614 | Testnet |
| Celo Alfajores | https://alfajores-forno.celo-testnet.org | 44787 | Testnet |


---

## 🔧 Hardhat v3 Migration Notes

This project has been migrated to **Hardhat v3** with the following changes:

- ✅ ESM modules support (`"type": "module"` in package.json)
- ✅ Updated network configuration format
- ✅ Viem integration for modern Ethereum interactions
- ✅ Ignition deployment modules
- ⚠️ Some packages show compatibility warnings (use `--force` flag)

### Local Development

```bash
# Start local node (generates test accounts)
npx hardhat node

# In another terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

**Test Accounts Available:**
- Account #0: `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266` (10000 ETH)
- Account #1: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8` (10000 ETH)
- *(18 more accounts available for testing)*

---

## 📖 Resources

* [Hardhat v3 Documentation](https://hardhat.org/docs)
* [Viem Documentation](https://viem.sh/)
* [Filecoin EVM Docs](https://docs.filecoin.io/smart-contracts/evm/)
* [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/)

## 🐛 Troubleshooting

### Common Issues

**Compilation Errors:**
```bash
# Clean and rebuild
npx hardhat clean
npx hardhat compile
```

**Dependency Conflicts:**
```bash
# Reinstall with force flag
rm -rf node_modules package-lock.json
npm install --force
```

**Network Connection Issues:**
- Ensure your `.env` file has correct RPC URLs
- Check that the target network is running
- Verify your private key has sufficient funds

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome. Please open an issue to discuss changes before submitting a PR.

---

## 📜 License

This project is licensed under the **MIT License**.

##  Hardhat v3 x Eth PeerFlow

Hardhat v3 provided Eth PeerFlow with the **speed, flexibility, and reliability** needed to build a real-time, cross-chain healthcare coordination system.
Its modern developer experience, strong plugin ecosystem, and compatibility with PyUSD and PPT token workflows made it an essential foundation for deploying **trustless financial and coordination infrastructure** on Ethereum.
