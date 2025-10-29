# 💵 **PayPal USD (PyUSD) Integration — Eth PeerFlow**

### *Stable, Programmable Payments for Emergency Healthcare and Counseling on Decentralized Infrastructure*

---

## 🧭 Overview

**Eth PeerFlow** uses **PayPal USD (PyUSD)** as its trusted, programmable **financial layer** for emergency healthcare, medical billing, and counseling coordination.

During crises where centralized networks or banking rails fail, our **peer‑to‑peer communication mesh (py‑libp2p)** ensures that **hospitals, patients, and insurers (TPAs)** can still:

* Communicate over a decentralized network,
* Verify incidents reliably,
* Settle payments **instantly and transparently** using PyUSD stablecoin.

🎥 **Demo / Screencast:** [https://drive.google.com/drive/folders/1R6Z0DItHK6L3KKyDEzptlqfQF_moayqh?usp=drive_link](https://drive.google.com/drive/folders/1R6Z0DItHK6L3KKyDEzptlqfQF_moayqh?usp=drive_link)

🎥 [Eth-PeerFlow x PaypalUSD(PyUSD) Comprehensive Demo Video](https://youtu.be/38yzN4IEaec)

Eth PeerFlow showcases how a **regulated, dollar‑backed stablecoin** can power:

* Predictable, low‑volatility medical payouts,
* Automated on-chain invoice verification and insurance reimbursements,
* Cross‑border tele‑counseling and humanitarian settlements, without dependency on centralized banks.

---

## ⚙️ Core Architecture

Eth PeerFlow’s PyUSD module is implemented using **Hardhat v3 smart contracts** deployed on **Ethereum Sepolia**. It powers a **trustless invoice + reimbursement workflow** across decentralized networks.


![PyUSD Invoice Flow](https://raw.githubusercontent.com/seetadev/Eth-PeerFlow/main/pyUSD-work-invoice-manager/PyUSD-Invoice-user-flow-diagram.png)


### 🔑 Key Components


![PyUSD Contract Attributes](https://raw.githubusercontent.com/seetadev/Eth-PeerFlow/main/pyUSD-work-invoice-manager/PyUSD-contract-attributes.png)


#### 1. **InvoiceManager.sol**

* Creates, approves, and settles invoices.
* Integrates directly with the PyUSD ERC‑20 contract.
* Supports automated reimbursements based on verified incident proofs.

#### 2. **Escrow Settlement Logic**

* Ensures stable, predictable payments using PyUSD.
* Locks funds until cryptographically verified release conditions are met.
* Enables cross‑chain healthcare transactions.

#### 3. **Hardhat v3 Integration**

* End‑to‑end contract development, deployment, and testing.
* Etherscan auto‑verification.
* Bridges Ethereum contracts with the decentralized libp2p network.

#### 4. **libp2p Mesh Connectivity**

* Resilient P2P invoice broadcasting.
* Works even when REST APIs or cloud infrastructure fail.

---

## 💡 Why PyUSD

* ✅ **Stable & Predictable** — Dollar‑backed value protects medical payouts.
* 🔒 **On‑Chain Verification** — Eliminates disputes via programmable settlement.
* 🌍 **Cross‑Border Access** — Supports global emergency counseling and aid.
* 🧩 **Regulated & Programmable** — ERC‑20 compatibility ensures easy integration, compliance, and auditability.

---

## 🔗 Live Deployments

| Component                        | Network          | Link                                                                                                                                                                                                     |
| -------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Verified Contract**            | Ethereum Sepolia | [https://sepolia.etherscan.io/address/0x1Ffa031c61B5b878D05a68D8A96B33e328364994](https://sepolia.etherscan.io/address/0x1Ffa031c61B5b878D05a68D8A96B33e328364994)                                       |
| **PyUSD Payment Transaction**    | Ethereum Sepolia | [https://sepolia.etherscan.io/tx/0x7b4b525e475dfd4e1337c322f46c56368d9408b123b32b832111cee92d626d8d](https://sepolia.etherscan.io/tx/0x7b4b525e475dfd4e1337c322f46c56368d9408b123b32b832111cee92d626d8d) |
| **Frontend Deployment (Vercel)** | —                | [https://pyusd-invoice-mvp.vercel.app/](https://pyusd-invoice-mvp.vercel.app/)                                                                                                                           |
| **Contract Source (GitHub)**     | —                | [https://github.com/seetadev/Eth-PeerFlow/tree/main/pyUSD-work-invoice-manager/blockchain](https://github.com/seetadev/Eth-PeerFlow/tree/main/pyUSD-work-invoice-manager/blockchain)                     |

---

## 🧱 How It Works

1. **Incident Logged** — Verified P2P via libp2p and stored on IPFS/Filecoin.
2. **Invoice Created** — Provider submits an invoice on-chain.
3. **Funds Locked** — TPA escrows PyUSD into the smart contract.
4. **Verification Triggered** — Upon incident confirmation, contract releases PyUSD automatically.
5. **Fully Auditable** — All payments, invoices, and releases are transparently verifiable on-chain.

---

## 🧩 Partner Technologies

| Technology             | Role                                         |
| ---------------------- | -------------------------------------------- |
| **Hardhat v3**         | Contract development, deployment, testing    |
| **PayPal USD (PyUSD)** | Stable, programmable financial layer         |
| **Hedera Hashgraph**   | Reputation scoring + verifiable coordination |
| **js‑libp2p**          | P2P mesh for resilient communication         |
| **Filecoin/IPFS**      | Immutable evidence + invoice storage         |

---

## 🌍 Impact

Eth PeerFlow demonstrates how **stablecoins can anchor decentralized healthcare finance**. By combining PyUSD with decentralized identity, P2P networking, and verifiable storage, it enables:

* Transparent reimbursements,
* Global healthcare access,
* Disaster‑resilient coordination,
* Stablecoin‑powered humanitarian impact.

---

# 🧩 Extended Implementation Details

## 🎯 User Flow

### 1. **Invoice Creation**

* Provider creates a blockchain invoice referencing an IPFS document.

### 2. **Payment Options**

* **Cash Payment:** Issuer pays a 0.01% platform fee.
* **Crypto Payment:** Customer pays via QR scan or payment link.

### 3. **Fee Distribution**

* **99.99% → Issuer wallet**
* **0.01% → Platform wallet**

---

## 🏗️ Architecture

### 🧱 Smart Contract Structure

#### **User Account**

* `wallet`: Ethereum address
* `createdBills[]`: issued invoices
* `paidBills[]`: completed invoices
* `type`: issuer or user
* `profile`: name, bio, links
* `verified`: admin‑verified flag

#### **Invoice Structure**

```
struct Invoice {
  uint256 id;
  address payable from;
  address to;
  uint256 amount;
  bool paid;
  string invoiceIpfsHash;
  string issuerBusinessName;
  string category;
  InvoiceStatus status;
  uint256 createdAt;
  uint256 paidAt;
  bool exists;
}
```

---

## 🗂️ Project Structure (Eth PeerFlow — PyUSD Module)

```
src/
├── abi/
├── components/
├── config/
├── contexts/
├── hooks/
├── pages/
├── services/
├── theme/
└── utils/

blockchain/
├── contracts/
├── scripts/
├── test/
└── utils/
```

---

# 🚀 Getting Started

## ✅ Prerequisites

* Node.js v16+
* npm or yarn
* MetaMask
* Firebase + Pinata accounts

## 📦 Installation

```
git clone https://github.com/anisharma07/pyusd-invoice-mvp.git
cd pyusd-invoice-mvp
npm install
```

### 🌐 Environment Variables (`.env`)

```
VITE_PINATA_API_KEY=...
VITE_PINATA_SECRET_KEY=...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_APP_ID=...
```

## ▶️ Run the App

```
npm run dev
```

## 🏗️ Build for Production

```
npm run build
```

---

# 💼 Smart Contract Details

* **Network:** Ethereum Sepolia
* **Address:** `0xE1D6BFe21AD6e58Bd9aeFd5C4D23600F794F450C`
* **PyUSD Token:** `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`

### 🔧 Key Features

#### ✅ User Accounts

* Issuer + Payer roles
* IPFS‑stored profiles
* Verification system
* Full invoice history

#### ✅ Invoices

* On‑chain registration
* Metadata + storage on IPFS
* Automatic fee distribution

#### ✅ Platform Fees

* Default: **0.01%**
* **99.99% → Issuer**
* **0.01% → Platform**

---

# 🔗 Blockchain Integration

### Frontend

* `abi/invoiceManage.ts` — Contract ABI
* `config/wagmi.ts` — Wallet controls
* `components/WalletConnect.tsx` — MetaMask
* `services/invoicePaymentService.ts` — Firebase sync

### Backend (Smart Contracts)

* Hardhat environment
* Full test suite
* IPFS utilities

---

# 📱 Features in Detail

### 1. Invoice Creation

* SocialCalc spreadsheet editor
* IPFS upload
* On-chain metadata registration

### 2. Payments

* QR codes
* MetaMask integration
* Stablecoin transfers

### 3. Viewing

* `/app/invoice/{id}`
* On-chain verification
* Etherscan links

### 4. Firebase Integration

* Real-time payment tracking
* IPFS → Firestore indexing

### 5. IPFS Storage

* Decentralized permanence
* Pinata integration

---

# 🧪 Testing

### Frontend

```
npm test
```

### Smart Contracts

```
cd blockchain
npx hardhat test
```

---

# 📦 Deployment

### Frontend (Vercel)

* Connect GitHub repo
* Add `.env`
* Deploy

### Smart Contracts

```
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
```

---

# 🔗 Links

* **Contract (Etherscan)** — see above
* **PayPal USD (PyUSD)** — ERC‑20 stablecoin

---

# 🙏 Acknowledgments

* SocialCalc — Spreadsheet engine
* Ionic — UI framework
* Wagmi & RainbowKit — Web3 integration
* Hardhat — Contract tooling
* PayPal — PyUSD stablecoin
* Pinata — IPFS storage
* Firebase — Real‑time backend
