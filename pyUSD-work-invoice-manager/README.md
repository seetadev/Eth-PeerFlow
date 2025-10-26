# 💵 **PayPal USD (PyUSD) Integration — Eth PeerFlow**

### *Stable, Programmable Payments for Emergency Healthcare and Counseling on Web3 Infrastructure*

---

## 🧭 Overview

**Eth PeerFlow** uses **PayPal USD (PyUSD)** as its trusted, programmable **financial layer** for emergency healthcare, medical billing, and counseling coordination.
In high-stress or disaster scenarios where centralized banking and API networks fail, **Eth PeerFlow’s peer-to-peer mesh (py-libp2p)** allows **hospitals, patients, and insurers (TPAs)** to continue communicating, verifying incidents, and settling payments **instantly and transparently** using **PyUSD**.

This integration demonstrates how a **regulated, dollar-backed stablecoin** can power **real-time healthcare settlements** and **cross-border humanitarian payouts**—bridging decentralized coordination, finance, and verified identity.

---

## 🎥 Demo / Screencast

**PyUSD Payment Flow Demo:**
[Watch Here →](https://drive.google.com/drive/folders/1R6Z0DItHK6L3KKyDEzptlqfQF_moayqh?usp=drive_link)

---

## ⚙️ Core Architecture

Eth PeerFlow’s PyUSD module is implemented through **Hardhat v3 smart contracts** deployed on **Ethereum Sepolia**.
It powers a **trustless invoice and reimbursement workflow**, automating how responders, providers, and TPAs exchange verified payment data on-chain.

### Key Components

1. **InvoiceManager.sol**

   * Manages invoice creation, approval, and settlement.
   * Integrates directly with PyUSD ERC-20 contract for escrow and transfer logic.
   * Supports automated reimbursements triggered by verified incident proofs.

2. **Escrow Settlement**

   * Ensures predictable and stable payments using PyUSD.
   * Funds are locked and released based on smart-contract verified triggers.
   * Enables low-fee, instant cross-chain healthcare transactions.

3. **Hardhat v3 Integration**

   * Provides end-to-end testing, deployment, and verification workflows.
   * Supports upgrades, gas benchmarking, and Etherscan auto-verification.
   * Bridges Ethereum smart contracts with the decentralized networking layer (libp2p).

4. **libp2p Mesh Connectivity**

   * Enables real-time, peer-to-peer communication even when APIs fail.
   * Ensures invoices and verifications can propagate without centralized servers.

---

## 💡 Why PyUSD

* **Predictable, Low-Volatility Payments** — Every reimbursement or settlement retains stable dollar value.
* **Automated, On-Chain Verification** — Smart contracts handle invoice validation and payment release logic.
* **Cross-Border Accessibility** — Enables international tele-counseling, aid distribution, and remote healthcare finance without dependence on banks.
* **Regulated & Programmable** — PyUSD’s transparency and ERC-20 compatibility make it ideal for compliant, verifiable humanitarian transactions.

---

## 🔗 Live Deployments

| Component                   | Network          | Link                                                                                                                   |
| --------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Verified Contract**       | Ethereum Sepolia | [View on Etherscan](https://sepolia.etherscan.io/address/0x1Ffa031c61B5b878D05a68D8A96B33e328364994)                   |
| **Pay Invoice Transaction** | Ethereum Sepolia | [Transaction Link](https://sepolia.etherscan.io/tx/0x7b4b525e475dfd4e1337c322f46c56368d9408b123b32b832111cee92d626d8d) |
| **Frontend Deployment**     | —                | [pyusd-invoice-mvp.vercel.app](https://pyusd-invoice-mvp.vercel.app/)                                                  |
| **Contract Source**         | GitHub           | [View on GitHub](https://github.com/seetadev/Eth-PeerFlow/tree/main/pyUSD-work-invoice-manager/blockchain)             |

---

## 🧱 How It Works

1. **Incident Logged** — Verified via libp2p network and stored on Filecoin/IPFS.
2. **Invoice Created** — Provider or counselor submits an on-chain invoice using the `InvoiceManager` contract.
3. **Funds Locked** — Payer (insurer/TPA) escrows PyUSD in the smart contract.
4. **Verification & Release** — Upon confirmation of incident validity, the contract automatically releases PyUSD to the recipient.
5. **Auditability** — All transactions and invoices remain verifiable on Ethereum and mirrored via Hedera anchors.

---

## 🧩 Partner Technologies

| Technology             | Role                                                          |
| ---------------------- | ------------------------------------------------------------- |
| **Hardhat v3**         | Smart contract orchestration, deployment, and testing         |
| **PayPal USD (PyUSD)** | Stable, programmable financial layer                          |
| **Hedera Hashgraph**   | Low-cost, high-throughput verification and reputation scoring |
| **js-libp2p**          | P2P communication and incident verification mesh              |
| **Filecoin/IPFS**      | Immutable storage for reports and evidence                    |

---

## 🌍 Impact

Eth PeerFlow’s PyUSD integration showcases how **stablecoins can anchor decentralized healthcare finance**, providing **speed, transparency, and resilience** during critical coordination scenarios.
By fusing **PyUSD’s real-world stability** with **decentralized infrastructure**, the system enables equitable access to aid, transparent payments, and reliable coordination even in times of disruption.

