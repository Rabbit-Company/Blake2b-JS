interface CTX {
	b: Uint8Array;
	h: Uint32Array;
	t: number;
	c: number;
	outlen: number;
}

/**
 * The `Blake2b` namespace provides functionality for generating Blake2b-512 cryptographic hashes.
 * It includes methods for creating hashes with optional HMAC mode, specifying output length,
 * and applying salt and personalization values.
 */
namespace Blake2b {
	const v = new Uint32Array(32);
	const m = new Uint32Array(32);

	const BLAKE2B_IV32 = new Uint32Array([
		0xf3bcc908, 0x6a09e667, 0x84caa73b, 0xbb67ae85, 0xfe94f82b, 0x3c6ef372, 0x5f1d36f1, 0xa54ff53a, 0xade682d1, 0x510e527f, 0x2b3e6c1f, 0x9b05688c, 0xfb41bd6b,
		0x1f83d9ab, 0x137e2179, 0x5be0cd19,
	]);

	const SIGMA8 = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1,
		9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5,
		15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2,
		13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6,
		1, 12, 0, 2, 11, 7, 5, 3,
	];

	const parameterBlock = new Uint8Array(64).fill(0);

	const SIGMA82 = new Uint8Array(
		SIGMA8.map(function (x) {
			return x * 2;
		})
	);

	function ADD64AA(v: Uint32Array, a: number, b: number): void {
		const o0 = v[a] + v[b];
		let o1 = v[a + 1] + v[b + 1];
		if (o0 >= 0x100000000) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}

	function ADD64AC(v: Uint32Array, a: number, b0: number, b1: number): void {
		let o0 = v[a] + b0;
		if (b0 < 0) o0 += 0x100000000;
		let o1 = v[a + 1] + b1;
		if (o0 >= 0x100000000) o1++;
		v[a] = o0;
		v[a + 1] = o1;
	}

	function B2B_GET32(arr: Uint8Array, i: number): number {
		return arr[i] ^ (arr[i + 1] << 8) ^ (arr[i + 2] << 16) ^ (arr[i + 3] << 24);
	}

	function B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number): void {
		const x0 = m[ix];
		const x1 = m[ix + 1];
		const y0 = m[iy];
		const y1 = m[iy + 1];

		ADD64AA(v, a, b);
		ADD64AC(v, a, x0, x1);

		let xor0 = v[d] ^ v[a];
		let xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor1;
		v[d + 1] = xor0;

		ADD64AA(v, c, d);

		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = (xor0 >>> 24) ^ (xor1 << 8);
		v[b + 1] = (xor1 >>> 24) ^ (xor0 << 8);

		ADD64AA(v, a, b);
		ADD64AC(v, a, y0, y1);

		xor0 = v[d] ^ v[a];
		xor1 = v[d + 1] ^ v[a + 1];
		v[d] = (xor0 >>> 16) ^ (xor1 << 16);
		v[d + 1] = (xor1 >>> 16) ^ (xor0 << 16);

		ADD64AA(v, c, d);

		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = (xor1 >>> 31) ^ (xor0 << 1);
		v[b + 1] = (xor0 >>> 31) ^ (xor1 << 1);
	}

	function blake2bCompress(ctx: CTX, last: boolean): void {
		let i = 0;

		for (i = 0; i < 16; i++) {
			v[i] = ctx.h[i];
			v[i + 16] = BLAKE2B_IV32[i];
		}

		v[24] = v[24] ^ ctx.t;
		v[25] = v[25] ^ (ctx.t / 0x100000000);

		if (last) {
			v[28] = ~v[28];
			v[29] = ~v[29];
		}

		for (i = 0; i < 32; i++) {
			m[i] = B2B_GET32(ctx.b, 4 * i);
		}

		for (i = 0; i < 12; i++) {
			B2B_G(0, 8, 16, 24, SIGMA82[i * 16 + 0], SIGMA82[i * 16 + 1]);
			B2B_G(2, 10, 18, 26, SIGMA82[i * 16 + 2], SIGMA82[i * 16 + 3]);
			B2B_G(4, 12, 20, 28, SIGMA82[i * 16 + 4], SIGMA82[i * 16 + 5]);
			B2B_G(6, 14, 22, 30, SIGMA82[i * 16 + 6], SIGMA82[i * 16 + 7]);
			B2B_G(0, 10, 20, 30, SIGMA82[i * 16 + 8], SIGMA82[i * 16 + 9]);
			B2B_G(2, 12, 22, 24, SIGMA82[i * 16 + 10], SIGMA82[i * 16 + 11]);
			B2B_G(4, 14, 16, 26, SIGMA82[i * 16 + 12], SIGMA82[i * 16 + 13]);
			B2B_G(6, 8, 18, 28, SIGMA82[i * 16 + 14], SIGMA82[i * 16 + 15]);
		}

		for (i = 0; i < 16; i++) {
			ctx.h[i] = ctx.h[i] ^ v[i] ^ v[i + 16];
		}
	}

	function blake2bInit(outlen: number, key: Uint8Array | undefined, salt: Uint8Array, personal: Uint8Array): CTX {
		if (outlen === 0 || outlen > 64) {
			throw new Error("Illegal output length, expected 0 < length <= 64");
		}
		if (key && key.length > 64) {
			throw new Error("Illegal key, expected Uint8Array with 0 < length <= 64");
		}
		if (salt && salt.length !== 16) {
			throw new Error("Illegal salt, expected Uint8Array with length is 16");
		}
		if (personal && personal.length !== 16) {
			throw new Error("Illegal personal, expected Uint8Array with length is 16");
		}

		const ctx: CTX = {
			b: new Uint8Array(128),
			h: new Uint32Array(16),
			t: 0,
			c: 0,
			outlen: outlen,
		};

		parameterBlock.fill(0);
		parameterBlock[0] = outlen;
		if (key) parameterBlock[1] = key.length;
		parameterBlock[2] = 1;
		parameterBlock[3] = 1;
		if (salt) parameterBlock.set(salt, 32);
		if (personal) parameterBlock.set(personal, 48);

		for (let i = 0; i < 16; i++) {
			ctx.h[i] = BLAKE2B_IV32[i] ^ B2B_GET32(parameterBlock, i * 4);
		}

		if (key) {
			blake2bUpdate(ctx, key);
			ctx.c = 128;
		}

		return ctx;
	}

	function blake2bUpdate(ctx: CTX, input: Uint8Array): void {
		for (let i = 0; i < input.length; i++) {
			if (ctx.c === 128) {
				ctx.t += ctx.c;
				blake2bCompress(ctx, false);
				ctx.c = 0;
			}
			ctx.b[ctx.c++] = input[i];
		}
	}

	function blake2bFinal(ctx: CTX): Uint8Array {
		ctx.t += ctx.c;

		while (ctx.c < 128) {
			ctx.b[ctx.c++] = 0;
		}
		blake2bCompress(ctx, true);

		const out = new Uint8Array(ctx.outlen);
		for (let i = 0; i < ctx.outlen; i++) {
			out[i] = ctx.h[i >> 2] >> (8 * (i & 3));
		}
		return out;
	}

	function blake2bStart(
		input: string | Uint8Array,
		key: Uint8Array | undefined,
		outlen: number,
		salt: string | Uint8Array,
		personal: string | Uint8Array
	): Uint8Array {
		outlen = outlen || 64;
		const ctx = blake2bInit(outlen, key, normalizeInput(salt), normalizeInput(personal));
		blake2bUpdate(ctx, normalizeInput(input));
		return blake2bFinal(ctx);
	}

	function normalizeInput(input: string | Uint8Array): Uint8Array {
		let ret;
		if (input instanceof Uint8Array) {
			ret = input;
		} else if (typeof input === "string") {
			const encoder = new TextEncoder();
			ret = encoder.encode(input);
		} else {
			throw new Error("Input must be an string, Buffer or Uint8Array");
		}
		return ret;
	}

	function toHex(bytes: Uint8Array): string {
		return Array.prototype.map
			.call(bytes, function (n) {
				return (n < 16 ? "0" : "") + n.toString(16);
			})
			.join("");
	}

	/**
	 * Computes the Blake2b hash of the provided message using the given parameters.
	 *
	 * @param {string | Uint8Array} message - The input data to be hashed. This can be a string or a Uint8Array.
	 * @param {string | Uint8Array | undefined} [secret] - An optional secret key for HMAC mode. This can be a string or a Uint8Array.
	 *     If not provided, a standard Blake2b hash will be computed. If provided, it should be between 1 and 64 bytes in length.
	 * @param {number} [length=64] - The desired length of the hash output in bytes. The value should be between 1 and 64. Defaults to 64 bytes.
	 * @param {string | Uint8Array} [salt=new Uint8Array(16)] - An optional salt value for the hash function. This can be a string or a Uint8Array.
	 *     The salt must be exactly 16 bytes long. Defaults to a zeroed 16-byte Uint8Array.
	 * @param {string | Uint8Array} [personal=new Uint8Array(16)] - An optional personalization string for the hash function. This can be a string or a Uint8Array.
	 *     The personalization string must be exactly 16 bytes long. Defaults to a zeroed 16-byte Uint8Array.
	 * @returns {string} - The hexadecimal representation of the Blake2b hash output.
	 *
	 * @throws {Error} If the provided output length (`length`) is not within the range of 1 to 64 bytes.
	 * @throws {Error} If the provided secret key exceeds 64 bytes in length.
	 * @throws {Error} If the provided salt is not exactly 16 bytes long.
	 * @throws {Error} If the provided personalization string is not exactly 16 bytes long.
	 *
	 * @example
	 * // Simple usage with a message
	 * const hashValue = hash('Hello, world!');
	 * console.log(hashValue); // Outputs the Blake2b hash as a hex string
	 *
	 * @example
	 * // Using a secret key for HMAC mode
	 * const hashWithKey = hash('Hello, world!', 'my-secret-key');
	 * console.log(hashWithKey); // Outputs the Blake2b HMAC as a hex string
	 *
	 * @example
	 * // Custom output length
	 * const shortHash = hash('Hello, world!', '', 32);
	 * console.log(shortHash); // Outputs a 32-byte Blake2b hash as a hex string
	 *
	 * @example
	 * // Using salt and personalization
	 * const saltedHash = hash('Hello, world!', '', 64, 'my-salt', 'my-personal');
	 * console.log(saltedHash); // Outputs a Blake2b hash with salt and personalization as a hex string
	 */
	export function hash(
		message: string | Uint8Array = "",
		secret: string | Uint8Array | undefined = undefined,
		length: number = 64,
		salt: string | Uint8Array = new Uint8Array(16),
		personal: string | Uint8Array = new Uint8Array(16)
	): string {
		if (secret?.length === 0) secret = undefined;
		if (typeof secret === "string") secret = new TextEncoder().encode(secret);

		const output = blake2bStart(message, secret, length, salt, personal);
		return toHex(output);
	}
}

export default Blake2b;
