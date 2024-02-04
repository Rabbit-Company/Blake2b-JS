export interface CTX {
	b: Uint8Array;
	h: Uint32Array;
	t: number;
	c: number;
	outlen: number;
}
export default class Blake2b {
	v: Uint32Array;
	m: Uint32Array;
	BLAKE2B_IV32: Uint32Array;
	SIGMA8: number[];
	parameterBlock: Uint8Array;
	SIGMA82: Uint8Array;
	ADD64AA(v: Uint32Array, a: number, b: number): void;
	ADD64AC(v: Uint32Array, a: number, b0: number, b1: number): void;
	B2B_GET32(arr: Uint8Array, i: number): number;
	B2B_G(a: number, b: number, c: number, d: number, ix: number, iy: number): void;
	blake2bCompress(ctx: CTX, last: boolean): void;
	blake2bInit(outlen: number, key: Uint8Array | undefined, salt: Uint8Array, personal: Uint8Array): CTX;
	blake2bUpdate(ctx: CTX, input: Uint8Array): void;
	blake2bFinal(ctx: CTX): Uint8Array;
	blake2bStart(input: string | Uint8Array, key: Uint8Array | undefined, outlen: number, salt: string | Uint8Array, personal: string | Uint8Array): Uint8Array;
	normalizeInput(input: string | Uint8Array): Uint8Array;
	toHex(bytes: Uint8Array): string;
	/**
	 * Calculates the Blake2b hash of the given message using the specified parameters.
	 *
	 * @param {string | Uint8Array} message - The input message to be hashed.
	 * @param {string | Uint8Array | undefined} secret - The secret key for HMAC mode (optional).
	 * @param {number} [length=64] - The desired length of the hash output in bytes (default is 64).
	 * @param {string | Uint8Array} [salt=new Uint8Array(16)] - The salt value for the hash function (default is a new Uint8Array(16)).
	 * @param {string | Uint8Array} [personal=new Uint8Array(16)] - The personalization string for the hash function (default is a new Uint8Array(16)).
	 * @returns {string} - The hexadecimal representation of the Blake2b hash output.
	*/
	static hash(message: string | Uint8Array | undefined, secret: string | Uint8Array | undefined, length?: number, salt?: string | Uint8Array, personal?: string | Uint8Array): string;
}

export {};
