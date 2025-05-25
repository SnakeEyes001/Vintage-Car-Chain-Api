# 🚗 vintage-car-chain-api

**vintage-car-chain-api** is a NestJS-powered API for managing **vintage car ownership and history** on a **private Ethereum-compatible blockchain**. The API provides secure endpoints to register cars, transfer ownership, view history, and integrate with mobile apps via REST or GraphQL.

---

## 🚀 Features

- 📜 Register vintage cars as unique digital assets (NFT/ERC721 or struct in smart contract)
- 🔑 Transfer ownership securely via blockchain transactions
- 🕓 View full ownership history of a vehicle
- 🔐 On-chain identity with wallet address (Metamask or mobile wallet)
- ⚙️ Works with private Ethereum chains (Geth, Besu, Hardhat local node)
- 📱 Mobile client friendly (Flutter, React Native)

---

## 🛠 Tech Stack

- NestJS (TypeScript)
- Web3.js or Ethers.js
- Smart Contracts (Solidity) deployed on private chain
- MongoDB (off-chain metadata)
- JWT Authentication (optional)
- Swagger API documentation

---

## 📦 Installation

```bash
git clone https://github.com/your-org/vintage-car-chain-api.git
cd vintage-car-chain-api
npm install
npm run start:dev
