# Blake2b-JS

Blake2b-512 implementation in JavaScript (ES6).

## Usage

### 1. Download library
```bash
npm i --save @rabbit-company/blake2b
```

### 2. Import library
```js
import Blake2b from "@rabbit-company/blake2b";
```

### 3. Hash
```js
/*

  Parameters:
  1. Message (String or Uint8Array)
  2. Secret (String or Uint8Array | undefined) <>
  3. Length (Int) <64> (Min = 0 and Max = 64)
  4. Salt (String or Uint8Array) <> (String with length 16 or Uint8Array)
  5. Personal (String or Uint8Array) <> (String with length 16 or Uint8Array)

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
Blake2b.hash("message", "secretKey", 32, "c32df5f2f3c77a03", "4862f0260a9803da");
```