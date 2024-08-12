# Blake2b-JS

A JavaScript (ES6) implementation of the Blake2b-512 cryptographic hash function.

## Usage

### 1. Download the library

```bash
npm i --save @rabbit-company/blake2b
```

### 2. Import the library

```js
import Blake2b from "@rabbit-company/blake2b";
```

### 3. Generate a Hash

```ts
/**
 * Generate a Blake2b hash.
 *
 * @param {string | Uint8Array} message - The input message to hash (required).
 * @param {string | Uint8Array | undefined} secret - An optional secret key for HMAC mode.
 * @param {number} [length=64] - The length of the hash output in bytes (default is 64, max is 64).
 * @param {string | Uint8Array} [salt] - An optional salt value for the hash (must be 16 bytes long).
 * @param {string | Uint8Array} [personal] - An optional personalization value (must be 16 bytes long).
 * @returns {string} - The hexadecimal representation of the hash.
 */

// Generate hash from the provided message
Blake2b.hash("message");

// Generate hash from the provided message and secret key
Blake2b.hash("message", "secretKey");

// Generate hash from the provided message, secret key and length
Blake2b.hash("message", "secretKey", 32);

// Generate hash from the provided message, secret key, length and salt
Blake2b.hash("message", "secretKey", 32, "c32df5f2f3c77a03");

// Generate hash from the provided message, secret key, length, salt and personal
Blake2b.hash(
	"message",
	"secretKey",
	32,
	"c32df5f2f3c77a03",
	"4862f0260a9803da"
);
```

### Parameters

- **message**: The input to be hashed. Can be a string or a Uint8Array.
- **secret**: (Optional) A secret key for HMAC mode. Can be a string or Uint8Array. If not provided, a standard Blake2b hash will be generated.
- **length**: (Optional) The length of the output hash in bytes. Defaults to 64. Must be between 1 and 64.
- **salt**: (Optional) A salt value for the hash. Must be a 16-byte string or Uint8Array.
- **personal**: (Optional) A personalization string for the hash. Must be a 16-byte string or Uint8Array.
