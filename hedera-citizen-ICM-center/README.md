# 🧭 Eth PeerFlow — Verifiable Emergency Coordination on Hedera

**Eth PeerFlow** leverages **Hedera Hashgraph** to deliver **verifiable trust, transparency, and auditability** for decentralized emergency coordination. In crisis environments where communication or payment systems may fail, Eth PeerFlow enables citizens, responders, hospitals, and TPAs to **log, verify, and reward emergency actions** through Hedera’s fast, low-cost, energy-efficient network.

🎥 **Demo / Screencast:** [https://drive.google.com/drive/folders/1-JJ_Qyo-FCsU3GJRMuVHu_1FfSQbRsKS?usp=sharing](https://drive.google.com/drive/folders/1-JJ_Qyo-FCsU3GJRMuVHu_1FfSQbRsKS?usp=sharing)

---

## ⚙️ How It Works

Eth PeerFlow uses **Hedera Smart Contracts**, **IPFS storage**, and **cross-chain proof anchoring** to maintain a **tamper-proof humanitarian registry**.

### Core Functions

* 📍 **Record** verified emergency incidents submitted by citizens and responders.
* 🏅 **Automate** reputation scoring and distribute tokenized rewards.
* 🔗 **Anchor** cross-chain proofs for invoices and incident data from **Ethereum** and **Filecoin**.

Hedera provides **strong governance transparency**, **fast finality**, and a **public consensus service**, making it ideal for maintaining a **publicly auditable yet privacy-respecting** registry of emergency events.

---

## 🌐 Deployment

| Component                         | Network        | Link                                                                                                         |
| --------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| **PPT Token Contract**            | Hedera Testnet | [https://hashscan.io/testnet/contract/0.0.7134953/abi](https://hashscan.io/testnet/contract/0.0.7134953/abi) |
| **Incident Contract**             | Hedera Testnet | [https://hashscan.io/testnet/contract/0.0.7135209](https://hashscan.io/testnet/contract/0.0.7135209)         |
| **Frontend (Vercel)**             | —              | [https://road-incident-dapp-hedera.vercel.app/](https://road-incident-dapp-hedera.vercel.app/)               |
| **EVM Incident Contract Address** | —              | `0x07Bc74258668113A0116ac51FB3053108a633DaD`                                                                 |

---

## 🧩 System Components

### 🧍 Citizen Reporter Interface

Web app for users to report and track incidents.

### 🏛️ Incident Verification Dashboard

Admin portal for authorities to verify and reward valid incidents.

### 🧠 Smart Contract System

Manages on-chain incident storage, verification, payments, and reward logic.

---

## 🏗️ Architecture

```
├── contracts/                      # Smart contracts (Foundry/Solidity)
│   ├── src/IncidentContract.sol    # Main incident management contract
│   └── script/                     # Deployment and interaction scripts
├── dapp/                           # Citizen reporter interface (React)
│   └── src/components/             # UI components
└── incident-verification/          # Authority verification interface (React)
    └── src/components/             # Verification dashboard components
```

---

## ✨ Key Features

### 🧍 Citizens — Reporter Interface

* 🔗 **Wallet Integration** via MetaMask
* 📋 **Incident Wizard** for guided reporting
* 📄 **PDF Generation** with metadata
* ☁️ **IPFS Storage** using Web3.Storage
* 📊 **Incident Dashboard**
* 💰 **Reward Tracker** for HBAR incentives

### 🏛️ Authorities — Verification Interface

* 🔐 **Role-Based Access Control**
* 📈 **Analytics Dashboard**
* ✅ **On-chain Verification** with auditability
* 💸 **Automated HBAR Rewards** via smart contract
* 🔍 **Full Evidence Review** with IPFS proofs

---

## ⚙️ Smart Contract Features

* 🏪 **Incident Storage**: immutable, timestamped records
* 👑 **Access Control**: owner-based verification
* 💎 **Reward Mechanism**: configurable HBAR payouts
* 🕐 **Blockchain Timestamps**
* 🔢 **Sequential IDs** for incident indexing

---

## 🛠️ Technology Stack

| Layer                | Technology                    |
| -------------------- | ----------------------------- |
| **Blockchain**       | Hedera Hashgraph (Testnet)    |
| **Smart Contracts**  | Solidity ^0.8.28 with Foundry |
| **Frontend**         | React 19 + TypeScript + Vite  |
| **Styling**          | Tailwind CSS 4.1              |
| **Web3 Integration** | Ethers.js 6.14                |
| **Storage**          | IPFS via Web3.Storage         |
| **PDF Engine**       | pdf-lib                       |
| **Icons/UI**         | Lucide React                  |

---

## 🚀 Quick Start

### ✅ Prerequisites

* Node.js 18+
* Foundry / Forge
* MetaMask wallet
* Web3.Storage account

### 1. Clone & Install

```
cd contracts && npm install
cd ../dapp && npm install
cd ../incident-verification && npm install
```

### 2. Deploy Smart Contracts

```
cd contracts
forge build
./script/deploy-incident-manager.sh
```

### 3. Run Applications

#### Citizen Reporter Interface

```
cd dapp
npm run dev
# http://localhost:5173
```

#### Authority Verification Dashboard

```
cd incident-verification
npm run dev
# http://localhost:5174
```

---

## 📱 User Workflows

### 👩‍💻 Citizen Flow

1. Connect MetaMask
2. Report incident with media & details
3. Generate metadata-rich PDF
4. Upload to IPFS
5. Submit record on Hedera
6. Track verification status & rewards

### 🧑‍⚖️ Verifier Flow

1. Connect as admin
2. Review unverified incidents
3. Analyze evidence & validate
4. Approve and release rewards

---

## 📄 Smart Contract Details

* **Contract Name:** `IncidentManager`
* **Network:** Hedera Testnet
* **Address:** `0xf12ead27305b91a03afbb413a2ed2f028e4c9e6b`
* **Default Reward:** `0.05 HBAR`

### Key Functions

```
reportIncident(string description)
verifyIncident(uint id) onlyOwner
getIncident(uint id) view
setRewardAmount(uint256 amount) onlyOwner
```

### Events

```
IncidentReported(id, reporter)
IncidentVerified(id, verifier)
RewardPaid(reporter, amount)
```

---

## 🌐 Network Configuration

| Parameter    | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| **Network**  | Hedera Testnet                                                 |
| **Chain ID** | 296                                                            |
| **RPC**      | [https://testnet.hashio.io/api](https://testnet.hashio.io/api) |
| **Explorer** | HashScan Testnet                                               |
| **Token**    | HBAR                                                           |

---

## 🏆 Benefits & Use Cases

### For Citizens

* Earn HBAR for verified reports
* Immutable documentation
* Transparent tracking

### For Authorities

* Crowdsourced data collection
* Immutable audit logs
* Reduced administrative overhead

### For Society

* Better road safety
* Reliable open data
* Resilient decentralized civic infrastructure

---

## 📋 Roadmap

✅ Mobile-responsive UI
✅ Multi-language support
✅ Photo/video evidence handling
📍 GPS integration
🗂 Incident categorization
📊 Advanced analytics dashboards
🚑 Integrations with emergency services
🌎 Mainnet deployment

---
