# AI-Powered Blockchain-Based Fake Product Detection System

A full-stack anti-counterfeit platform that combines **blockchain-backed product traceability**, **QR-based verification**, and **AI-assisted image analysis** to help users verify product authenticity and monitor supply-chain activity.

## Overview

Counterfeit products can enter supply chains at different stages, making it difficult for consumers and businesses to establish product authenticity. This project provides a digital verification system where manufacturers register products, supply-chain partners record product movement, and consumers verify products using QR codes and product images.

The system combines blockchain records with a backend database and AI services to support product traceability, authenticity checks, and suspicious scan-behavior analysis.

## Key Features

### Product Registration and Traceability
- Manufacturer account registration and admin approval workflow
- Product registration with unique product identifiers
- QR code generation for registered products
- Blockchain-backed product records
- Supply-chain lifecycle tracking

### Product Lifecycle Management
Products move through defined lifecycle stages:

`MINTED → IN_TRANSIT → RECEIVED_BY_RETAILER → SOLD`

- Role-based lifecycle actions for authorized supply-chain participants
- Wallet-based transaction submission
- Transaction receipt and blockchain-state verification
- Lifecycle records displayed through role-specific dashboards

### Consumer Verification
- QR camera scanning
- Manual product-code lookup
- Product image upload for supported verification
- Registry and blockchain record checks
- Clear verification outcomes, including unavailable or unsupported results

### AI-Assisted Detection
- CNN-based image classification for supported medicine products
- Image hash comparison against the registered product image
- Isolation Forest-based scan-behavior anomaly scoring
- Suspicious scan indicators based on available scan history

> **AI scope:** The CNN was trained and evaluated on a fake-versus-real medicine image dataset. It has not been validated for electronics, cosmetics, clothing, food, or other product categories. AI results are decision-support signals, not a guarantee of authenticity.

### Admin Dashboard
- Manufacturer and supply-chain partner approval workflows
- Product and verification monitoring
- Scan and fraud-alert visibility
- Paginated data views and filters
- Blockchain and lifecycle information

### Privacy and Security
- Role-based access control
- Authenticated API requests
- Wallet and transaction validation for blockchain operations
- Explicit user consent before collecting verification location
- Location data is not inferred when consent or valid coordinates are absent
- AI service authentication using a configured service token

## System Architecture

```text
React Frontend
     |
     v
Node.js / Express Backend
     |
     +---------- MongoDB
     |
     +---------- Ethereum Smart Contract
     |
     +---------- Python FastAPI AI Service
                    |
                    +-- CNN Image Classification
                    +-- Image Hash Comparison
                    +-- Isolation Forest Scoring
```

### Main Components

| Component | Responsibility |
|---|---|
| React frontend | Role-based dashboards, product workflows, QR and image verification |
| Node.js / Express | Authentication, APIs, product registration, lifecycle and verification logic |
| MongoDB | User profiles, product metadata, verification records and lifecycle operations |
| Solidity smart contract | Blockchain-backed product registration and lifecycle records |
| Hardhat | Smart contract development and testing |
| Python / FastAPI | AI inference and scan-behavior scoring |
| TensorFlow / Keras | CNN image classification |
| scikit-learn | Isolation Forest anomaly detection |
| QR Code | Product identification and consumer verification |
| SHA-256 | Exact image-byte hash comparison |

## Technology Stack

**Frontend**
- React.js
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication

**Blockchain**
- Solidity
- Hardhat
- ethers.js
- Ethereum Sepolia test network

**AI / Machine Learning**
- Python
- FastAPI
- TensorFlow
- Keras
- scikit-learn
- OpenCV

## AI Model Evaluation

The clean CNN evaluation used a deduplicated dataset split to reduce exact-image leakage between training, validation, and test data.

| Metric | Result |
|---|---:|
| Test accuracy | 91.75% |
| Correct predictions | 89 / 97 |
| Incorrect predictions | 8 / 97 |

These results apply to the evaluated medicine-image dataset and should not be interpreted as performance across all product categories or real-world counterfeit scenarios.

## Repository Structure

```text
Anti-counterfeit/
├── ai/
│   ├── models/
│   │   └── saved_models/
│   └── service/
│       └── app.py
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── tests/
├── blockchain/
│   ├── contracts/
│   ├── scripts/
│   └── test/
├── frontend/
│   ├── public/
│   ├── src/
│   └── tests/
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js and npm
- Python 3.13
- MongoDB
- Git
- A compatible Ethereum wallet for blockchain interactions

### 1. Clone the Repository

```bash
git clone https://github.com/Sode-Aishwarya/Anti-counterfeit.git
cd Anti-counterfeit
```

### 2. Configure Environment Variables

Create local environment files using the provided example files:

- `backend/.env.example`
- `blockchain/.env.example`

Fill in the required local configuration values. **Do not commit real credentials, private keys, database passwords, or service tokens.**

The AI service and backend must use the same configured AI service token when AI integration is enabled.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

### 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend using the available project script:

```bash
npm run dev
```

### 5. Run the AI Service

Open another terminal:

```bash
cd ai
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
uvicorn service.app:app --host 0.0.0.0 --port 8000
```

The AI service requires its configured model files and environment variables to be available.

### 6. Run Smart Contract Tests

From the blockchain directory:

```bash
cd blockchain
npm install
npx hardhat test
```

> Deployment configuration, contract addresses, and network settings depend on the environment files. Confirm the current project configuration before deploying to a network.

## Testing

The project includes automated tests for backend services, frontend behavior, and smart-contract functionality.

Latest recorded test results:

| Test Suite | Passed | Failed |
|---|---:|---:|
| Backend | 200 | 0 |
| Frontend | 29 | 0 |
| **Total** | **229** | **0** |

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Run smart-contract tests:

```bash
cd blockchain
npx hardhat test
```

## Deployment

The frontend and backend have been deployed using Render.

- **Frontend:** https://anti-counterfeit-1.onrender.com/
- **Backend:** https://anti-counterfeit.onrender.com

The AI service is a separate FastAPI service. Its deployment URL and readiness should be confirmed from the current deployment configuration before use.

## Limitations

- The CNN model is trained on medicine images and is not validated for other product categories.
- SHA-256 image comparison checks exact file bytes. Resized, recompressed, or otherwise modified images produce different hashes.
- AI predictions can be incorrect and should not be treated as definitive proof of authenticity.
- Scan-behavior scoring depends on sufficient, valid verification history and available data.
- Blockchain operations require the configured network, contract, and authorized wallet.
- Deployment availability may depend on the hosting provider and service configuration.

## Future Enhancements

- Expand and validate image datasets for additional product categories
- Improve model robustness against image transformations
- Add richer supply-chain analytics and reporting
- Improve fraud-alert workflows and notification support
- Conduct broader end-to-end testing across deployed services
- Evaluate performance and reliability under realistic usage conditions

## Contributors

Developed as a collaborative undergraduate major project.

Contributions include frontend development, backend APIs, AI integration, blockchain functionality, testing, and documentation.

## Disclaimer

This project is an academic prototype intended to demonstrate blockchain-based traceability and AI-assisted counterfeit detection. It is not a certified product-authentication service and should not be used as the sole basis for safety-critical or commercial authenticity decisions.