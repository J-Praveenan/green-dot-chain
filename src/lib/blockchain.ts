import { BlockfrostProvider, Transaction } from "@meshsdk/core";
import type { TreeProofRecord } from "@/types";

function chunkString(value: string, size = 60) {
  return value.match(new RegExp(`.{1,${size}}`, "g")) || [];
}


//   BLOCKFROST PROVIDER  
export const provider = new BlockfrostProvider(
  process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_KEY!
);

// BUILD BLOCKCHAIN METADATA 
export function buildProofMetadata(record: TreeProofRecord) {
  return {
    "674": {
      msg: ["GreenDot Chain Tree Proof"],
    },
    "2026": {
      app: "GreenDot Chain",
      type: "TREE_PLANTATION_PROOF",
      proofId: record.id,
      campaign: "IPL 2026",
      matchName: record.matchName,
      overNumber: record.overNumber,
      bowlerName: record.bowlerName,
      treesCount: record.treesCount,
      location: record.location,
      plantationDate: record.plantationDate,
      verifierName: record.verifierName,
      imageName: record.imageName,
      imageHash: record.imageHash,
      issuerWallet: chunkString(record.issuerWallet),
      issuedAt: record.issuedAt,
    },
  };
}

//  SUBMIT PROOF TO BLOCKCHAIN
export async function submitProofToBlockchain(
  wallet: any,
  record: TreeProofRecord
) {
  const address = await wallet.getChangeAddress();

  const tx = new Transaction({
    initiator: wallet,
    fetcher: provider,
    submitter: provider,
  });

  tx.sendLovelace(address, "1000000");

  tx.setMetadata(674, {
    msg: ["GreenDot Chain Tree Proof"],
  });

  tx.setMetadata(2026, {
    app: "GreenDot Chain",
    type: "TREE_PLANTATION_PROOF",
    proofId: record.id,
    campaign: "IPL 2026",
    matchName: record.matchName,
    overNumber: record.overNumber,
    bowlerName: record.bowlerName,
    treesCount: record.treesCount,
    location: record.location,
    plantationDate: record.plantationDate,
    verifierName: record.verifierName,
    imageName: record.imageName,
    imageHash: record.imageHash,
    imageCid: record.imageIpfsCid,
    imageUrl: chunkString(record.imageIpfsUrl),
    issuerWallet: chunkString(record.issuerWallet),
    issuedAt: record.issuedAt,
  });

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);

  return txHash;
}


import axios from "axios";

const BLOCKFROST_API =
  "https://cardano-preprod.blockfrost.io/api/v0";

const BLOCKFROST_KEY =
  process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_KEY!;

export function extractTxHash(value: string) {
  if (!value) return "";

  const trimmed = value.trim();

  if (trimmed.includes("/transaction/")) {
    return trimmed.split("/transaction/")[1].split("?")[0];
  }

  return trimmed;
}


// FETCH BLOCKCHAIN TRANSACTION DATA 
export async function fetchTransactionMetadata(txHash: string) {
  try {
    const cleanedHash = extractTxHash(txHash);

    const txHashRegex = /^[a-f0-9]{64}$/i;

    if (!txHashRegex.test(cleanedHash)) {
      return {
        success: false,
        message:
          "Invalid transaction hash. Please enter a valid 64-character Cardano transaction hash.",
        data: null,
      };
    }

    const response = await axios.get(
      `${BLOCKFROST_API}/txs/${cleanedHash}/metadata`,
      {
        headers: {
          project_id: BLOCKFROST_KEY,
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      return {
        success: false,
        message: "No proof metadata found for this transaction.",
        data: null,
      };
    }

    return {
      success: true,
      message: "Metadata fetched successfully.",
      data: response.data,
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        success: false,
        message:
          "Transaction not found. Please check the transaction hash and try again.",
        data: null,
      };
    }

    return {
      success: false,
      message:
        "Unable to fetch blockchain metadata. Please check your internet connection or try again later.",
      data: null,
    };
  }
}


// VERIFY IMAGE AGAINST BLOCKCHAIN  
export async function verifyProofOnBlockchain(
  txHash: string,
  uploadedImageHash: string
) {
  const metadataResponse = await fetchTransactionMetadata(txHash);

  if (!metadataResponse.success || !metadataResponse.data) {
    return {
      valid: false,
      reason: metadataResponse.message,
    };
  }

  const proofMetadata = metadataResponse.data.find(
    (item: any) => item.label === "2026"
  );

  if (!proofMetadata) {
    return {
      valid: false,
      reason:
        "GreenDot proof metadata is missing from this transaction.",
    };
  }

  const blockchainHash = proofMetadata.json_metadata.imageHash;

  if (!blockchainHash) {
    return {
      valid: false,
      reason:
        "Image hash is missing in the blockchain metadata.",
    };
  }

  const finalHash = Array.isArray(blockchainHash)
    ? blockchainHash.join("")
    : blockchainHash;

  const valid = finalHash === uploadedImageHash;

  return {
    valid,
    reason: valid
      ? "Image verified successfully with blockchain metadata."
      : "Uploaded image does not match the blockchain image hash.",
    blockchainHash: finalHash,
    uploadedHash: uploadedImageHash,
    metadata: proofMetadata.json_metadata,
  };
}



//  CARDANOSCAN EXPLORER   
export function getCardanoScanTxUrl(txHash: string) {
  return `https://preprod.cardanoscan.io/transaction/${txHash}`;
}

export function openTxInExplorer(txHash: string) {
  if (!txHash) return;

  window.open(getCardanoScanTxUrl(txHash), "_blank", "noopener,noreferrer");
}



//  PINATA / IPFS     
export async function uploadFileToPinata(file: File) {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    throw new Error("Pinata JWT is missing");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload file to IPFS");
  }

  const data = await response.json();

  return {
    cid: data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
  };
}