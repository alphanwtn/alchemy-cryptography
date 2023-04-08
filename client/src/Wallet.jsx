import React, { useEffect } from "react";
import server from "./server";

import { getPublicKey } from "ethereum-cryptography/secp256k1";
import { toHex, bytesToHex, utf8ToBytes } from "ethereum-cryptography/utils";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function getAddressAndBalance() {
    let publicKey = "";

    try {
      publicKey = bytesToHex(getPublicKey(privateKey.slice(2)));
      setAddress(`0x${publicKey}`);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } catch (err) {
      setAddress("Invalid private key");
      setBalance(0);
    }
  }

  async function onChangePrivateKey(evt) {
    const key = evt.target.value;
    setPrivateKey(key);
  }

  useEffect(() => {
    getAddressAndBalance();
  }, [privateKey, address]);

  const borderObject = (() => {
    if (address === "Invalid private key") {
      return { borderColor: "red" };
    } else {
      return { borderColor: "green" };
    }
  })();

  return (
    <div className="container wallet" style={borderObject}>
      <h1>Your Wallet</h1>

      <label>
        Wallet Address (auto generated)
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          disabled
        ></input>
      </label>

      <label>
        Private key
        <input
          placeholder="Your private key"
          value={privateKey}
          onChange={onChangePrivateKey}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
