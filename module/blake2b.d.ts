/**
 * The `Blake2b` namespace provides functionality for generating Blake2b-512 cryptographic hashes.
 * It includes methods for creating hashes with optional HMAC mode, specifying output length,
 * and applying salt and personalization values.
 */
declare namespace Blake2b {
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
	function hash(message?: string | Uint8Array, secret?: string | Uint8Array | undefined, length?: number, salt?: string | Uint8Array, personal?: string | Uint8Array): string;
}

export {
	Blake2b as default,
};

export {};
