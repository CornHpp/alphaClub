import forge from "node-forge";

export async function generateKeyPair() {
  const rsa = forge.pki.rsa;
  const keypair = rsa.generateKeyPair({ bits: 2048 });
  return keypair;
}

export function encryptWithPublicKey(
  publicKey: forge.pki.PublicKey,
  text: string
) {
  //   const encrypted = publicKey.encrypt(text, "RSA-OAEP", {
  //     md: forge.md.sha256.create(),
  //   });
  const encrypted = "";
  return encrypted;
}

export function decryptWithPrivateKey(
  pK: forge.pki.PrivateKey,
  encryptedData: string
) {
  const privateKeyPem = forge.pki.privateKeyToPem(pK);
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedData);

  const decryptedBytes = privateKey.decrypt(encryptedBytes);
  return forge.util.decodeUtf8(decryptedBytes);
}

export function getPublicKeyPEM(pair: any) {
  const pem = forge.pki.publicKeyToPem(pair.publicKey);

  const publicKey = forge.pki.publicKeyFromPem(pem);

  // 转换为 DER，然后编码为 Base64
  const publicKeyDer = forge.asn1
    .toDer(forge.pki.publicKeyToAsn1(publicKey))
    .getBytes();
  const publicKeyBase64 = forge.util.encode64(publicKeyDer);
  return publicKeyBase64;
}
