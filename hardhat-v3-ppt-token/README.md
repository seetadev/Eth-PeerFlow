# 📦 PPT-FIL-Token (Hardhat v3)

**PPT-FIL-Token** is an **ERC-20 utility token** with **medical invoice management** capabilities. This project demonstrates token-gated access for dApps and includes a complete medical invoice contract system.

> **🎉 Recently migrated to Hardhat v3** for improved performance and modern tooling support.

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
