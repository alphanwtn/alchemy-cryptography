const secp = require("ethereum-cryptography/secp256k1");
const { bytesToHex, hexToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);

console.log("Pr :", bytesToHex(privateKey));
console.log("Pu : ", bytesToHex(publicKey));
