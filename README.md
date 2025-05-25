# 🚗 vintage-car-chain-api

A NestJS backend API that interacts with a **Hyperledger Fabric network** (Org1 & Org2) to manage **vintage car ownership**, transfers, and historical tracking. Designed to be consumed by mobile apps and dashboards.

---

## 🛠 Tech Stack

- NestJS (TypeScript)
- Hyperledger Fabric SDK
- MongoDB (off-chain metadata)
- REST API with Swagger
- Docker (optional)

---

## ⚙️ Blockchain Setup (Hyperledger Fabric)

- Network includes:
  - Org1, Org2 with their own peers
  - Orderer node
  - CouchDB (for chain state)
- Channel: `vintagechannel`
- Chaincode: `vintagecarcc`

---

## 🔐 Chaincode Sample (Go)

```go
type VintageCar struct {
  VIN           string   `json:"vin"`
  Brand         string   `json:"brand"`
  Model         string   `json:"model"`
  Year          int      `json:"year"`
  CurrentOwner  string   `json:"currentOwner"`
  PreviousOwners []string `json:"previousOwners"`
}
