import { supabase } from "./supabase";


// Check whether image hash already exists

export async function checkDuplicateImageHash(
  imageHash: string
) {
  const { data, error } = await supabase
    .from("proofs")
    .select("*")
    .eq("image_hash", imageHash)
    .maybeSingle();

  if (error) {
    throw new Error(
      "Failed to check duplicate proof."
    );
  }

  return data;
}

/**
 * Save blockchain proof index
 */
export async function saveProofIndex({
  proofId,
  imageHash,
  txHash,
  imageIpfsCid,
  imageIpfsUrl,
}: {
  proofId: string;
  imageHash: string;
  txHash: string;
  imageIpfsCid: string;
  imageIpfsUrl: string;
}) {
  const { error } = await supabase
    .from("proofs")
    .insert({
      proof_id: proofId,
      image_hash: imageHash,
      tx_hash: txHash,
      image_ipfs_cid: imageIpfsCid,
      image_ipfs_url: imageIpfsUrl,
    });

  if (error) {
    throw new Error(
      "Failed to save proof registry."
    );
  }
}