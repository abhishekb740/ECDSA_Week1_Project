const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")

function generateKeys() {

    // public and private key object
    keys = {}

    for (let i = 0; i < 3; i++) {
        const privateKey = toHex(secp.utils.randomPrivateKey());
        const publicKey = toHex(secp.getPublicKey(privateKey))
        const address = publicKey.slice(-20)
        keys["key"+i] = [privateKey, publicKey, address]
    }
    return keys
}
console.log(generateKeys())
/* 
{
  key0: [
    '91c23b0d76b54aefa40431a0b24b6deec90c0cb17228775ca34728b7062bf5f9',
    '0466db1d1a8e5f2da5e920de515e0e65a65f6d984bd39cd2a234831c8d863f52849f1be97ee47ab82d5db872a054c14b2d85b1e59cea1259b139d0f99a38337293',
    '59b139d0f99a38337293'
  ],
  key1: [
    '6f54ac3e6514313996563125b63bb92d06b0cd51993701150036b33eebeada1c',
    '0401a83a4f18bc558d99ef5d47814f76525778421a2552b39875eaeefc509bea07c8f21df4bfc885f064791f0c07dbe275c72e635dd45deab303e28c4094399e90',
    'eab303e28c4094399e90'
  ],
  key2: [
    '1a6ab8e6674cfc32b459bb932361f424659774a1061ab3532729611ee1bad125',
    '0408ec36d24cfae17df800146e60d47ebf6fae2eb556c1ab46e12210a5e4ff11ab65b7936f8a2ce0b7be92966d23ac5c038581fd2f52438f3174bd8ce78ff76f08', 
    '8f3174bd8ce78ff76f08'
  ]
}
  */