export type ProofStatus = "Draft" | "On-chain Verified";

export type TreeProofRecord = {
  id: string;
  matchName: string;
  overNumber: string;
  bowlerName: string;
  treesCount: number;
  location: string;
  plantationDate: string;
  verifierName: string;

  imageName: string;
  imageHash: string;
  imageIpfsCid: string;
  imageIpfsUrl: string;

  issuerWallet: string;
  txHash: string;
  qrData: string;
  issuedAt: string;
  status: ProofStatus;
};