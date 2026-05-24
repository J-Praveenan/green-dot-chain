# 🌱 GreenDot Chain

GreenDot Chain is a blockchain-powered sustainability proof verification platform built on the Cardano blockchain.  
The platform enables IPL sustainability campaigns to securely verify planted tree proofs using SHA256 hashing, IPFS decentralized storage, QR verification, and immutable Cardano metadata.

---

# 🚀 Features

- 🌳 Tree Plantation Proof Issuing
- 🔐 SHA256 Image Hash Verification
- ⛓️ Cardano Blockchain Metadata Storage
- ☁️ IPFS File Upload using Pinata
- 📄 Professional Blockchain Certificate PDF Generation
- 📱 QR Code Verification
- 🛡️ Duplicate Image Proof Prevention
- 🔎 Public Blockchain Verification
- 🎨 Modern Responsive UI
- 🔔 Global Toast Notification System

---

# 🏗️ Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React

## Blockchain

- Cardano
- MeshJS
- Blockfrost API

## Storage

- IPFS (Pinata)

## Database

- Supabase

## PDF & QR

- jsPDF
- QRCode

---

# 📸 Project Workflow

```text
Upload Tree Image
        ↓
Generate SHA256 Hash
        ↓
Check Duplicate Image in Supabase
        ↓
Upload Image to IPFS
        ↓
Store Metadata on Cardano Blockchain
        ↓
Generate Blockchain Certificate PDF
        ↓
Generate QR Verification
        ↓
Public Proof Verification
```

---

# ⚙️ Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_BLOCKFROST_PREPROD_KEY=YOUR_BLOCKFROST_KEY

NEXT_PUBLIC_PINATA_JWT=YOUR_PINATA_JWT

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/J-Praveenan/green-dot-chain.git
```

## 2. Navigate to Project

```bash
cd greendot-chain
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Development Server

```bash
npm run dev
```

---

# 🗄️ Supabase Setup

## Create Table

Run this SQL in Supabase SQL Editor:

```sql
create table proofs (
  id uuid primary key default gen_random_uuid(),

  proof_id text not null,

  image_hash text unique not null,

  tx_hash text not null,

  image_ipfs_cid text,

  image_ipfs_url text,

  created_at timestamp with time zone default now()
);
```

---

## Enable RLS

Enable Row Level Security (RLS) for the `proofs` table.

---

## Create Policies

### INSERT Policy

```sql
create policy "Allow public insert"
on proofs
for insert
to public
with check (true);
```

### SELECT Policy

```sql
create policy "Allow public select"
on proofs
for select
to public
using (true);
```

---

# 🔗 Cardano Blockchain Metadata

The platform stores the following metadata on Cardano:

- Proof ID
- Match Name
- Over Number
- Bowler Name
- Trees Count
- Location
- Plantation Date
- Verifier Name
- SHA256 Image Hash
- IPFS CID
- IPFS URL
- Issuer Wallet
- Issued Timestamp

---

# ☁️ IPFS Integration

Images are uploaded to IPFS using Pinata.

Returned:

- IPFS CID
- Public Gateway URL

---

# 📄 Certificate Generation

The generated PDF certificate contains:

- Plantation Proof Details
- SHA256 Image Hash
- Cardano Transaction Hash
- IPFS CID
- QR Verification Code
- Blockchain Verification Timestamp

All hash values are selectable and copyable.

---

# 🔍 Verification Process

## Verification Flow

```text
Upload Verification Image
        ↓
Generate SHA256 Hash
        ↓
Fetch Blockchain Metadata
        ↓
Compare Hashes
        ↓
Show Verification Result
```

---

# 🛡️ Duplicate Prevention

Duplicate tree proof submissions are prevented using:

- SHA256 image hashing
- Supabase image hash indexing
- Blockchain metadata verification

---

# 📱 QR Verification

Generated QR codes redirect users to:

- CardanoScan transaction explorer
- Public blockchain proof verification

---

# 🔥 Core Libraries

```bash
@meshsdk/core
@meshsdk/react
@supabase/supabase-js
react-toastify
jspdf
qrcode
crypto-js
lucide-react
```

---

# 🌐 Blockchain Network

Current Network:

```text
Cardano Preprod
```

Explorer:

```text
https://preprod.cardanoscan.io
```

---

# 👨‍💻 Author

Praveenan Jeevarethinam

