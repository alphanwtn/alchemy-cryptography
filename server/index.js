const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { bytesToHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x0410e85ef7caf69dabd8b0231131dd920b3b87e43aee851e9df47f006eb2101b054f70dba7cf536d1cf78f9c8df97642efde2d43fa8442ad19a0523e698f07171b": 50,
  //pr : 0x99b0e1e0b912ad4c0246472109d3f29f7b1b53e4aa4f9a29fb9daaec94316275
  "0x042fc01b96a43ab5c3d1d6de569e0e2446d864a65f6ae8df7c22066c15b29d8a306beb05336977c1fc43f35516bcfd8b005bb50f61463b2820d2357ba58be64cb0": 75,
  //pr : 0x709cd96b0521a4966963b4e80b875c939e79d30b45404a2e04e4f3dd8549010e
  "0x04b75d873092381b6f57888ba3f776bdfcfc742da8b640ab111c250db6dd66e3530b1dd0e358ece3299cf02bbb2df622902dc77bf9db02734287a07fc731a0231e": 34,
  //pr : 0xd99b03193845ed094b8b100a0e212b4e92170980cc2b9a6d7b39cf07b8ec81a0
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, senderPrivate, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (
    sender.slice(2) !== bytesToHex(secp.getPublicKey(senderPrivate.slice(2)))
  ) {
    res.status(400).send({ message: "Private key not valid !!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
