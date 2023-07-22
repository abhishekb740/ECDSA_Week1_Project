const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "0466db1d1a8e5f2da5e920de515e0e65a65f6d984bd39cd2a234831c8d863f52849f1be97ee47ab82d5db872a054c14b2d85b1e59cea1259b139d0f99a38337293": 100,
  "0401a83a4f18bc558d99ef5d47814f76525778421a2552b39875eaeefc509bea07c8f21df4bfc885f064791f0c07dbe275c72e635dd45deab303e28c4094399e90": 50,
  "0408ec36d24cfae17df800146e60d47ebf6fae2eb556c1ab46e12210a5e4ff11ab65b7936f8a2ce0b7be92966d23ac5c038581fd2f52438f3174bd8ce78ff76f08": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, nonce, signTxn } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  // retrieve signature and recovery bit 
  const [signature, recoveryBit] = signTxn;
  // convert signature to Uint8Array
  const formattedSignature = Uint8Array.from(Object.values(signature));
  //message hash
  const msgToBytes = utf8ToBytes(recipient + amount + JSON.stringify(nonce));
  const msgHash = toHex(keccak256(msgToBytes));

  // recover public key
  const publicKey = await secp.recoverPublicKey(msgHash, formattedSignature, recoveryBit);

  // verify transection 
  const verifyTx = secp.verify(formattedSignature, msgHash, publicKey)
  console.log(sender);
  console.log(balances[sender]);
  console.log(recipient);
  console.log(balances[recipient]);
  if (!verifyTx) {
    res.status(400).send({ message: "Invalid Transaction" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }
  else if (sender == recipient) {
    res.status(400).send({ message: "Please! Enter Another address" })
  }
  
  else if(recipient && amount) {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
  else {
    res.status(400).send({ message: "Something Went Wrong !!" })
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
