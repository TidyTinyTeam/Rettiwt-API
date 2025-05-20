import axios from 'axios';

import { EApiErrors } from '../../enums/Api';
import { AuthCredential } from '../../models/auth/AuthCredential';
import { RettiwtConfig } from '../../models/RettiwtConfig';

/**
 * The services that handles authentication.
 *
 * @internal
 */
export class AuthService {
	/** The config object. */
	private readonly _config: RettiwtConfig;

	/**
	 * @param config - The config for Rettiwt.
	 */
	public constructor(config: RettiwtConfig) {
		this._config = config;
	}

	/**
	 * Decodes the encoded cookie string.
	 *
	 * @param encodedCookies - The encoded cookie string to decode.
	 * @returns The decoded cookie string.
	 */
	public static decodeCookie(encodedCookies: string): string {
		// 使用浏览器的atob函数代替Buffer
		return atob(encodedCookies);
	}

	/**
	 * Encodes the given cookie string.
	 *
	 * @param cookieString - The cookie string to encode.
	 * @returns The encoded cookie string.
	 */
	public static encodeCookie(cookieString: string): string {
		// 使用浏览器的btoa函数代替Buffer
		return btoa(cookieString);
	}

	/**
	 * Gets the user's id from the given API key.
	 *
	 * @param apiKey - The API key.
	 * @returns The user id associated with the API key.
	 */
	public static getUserId(apiKey: string): string {
		// Getting the cookie string from the API key
		const cookieString: string = AuthService.decodeCookie(apiKey);

		// Searching for the user id in the cookie string
		const searchResults: string[] | null = cookieString.match(
			/((?<=twid="u=)(\d+)(?="))|((?<=twid=u%3D)(\d+)(?=;))/,
		);

		// If user id was found
		if (searchResults) {
			return searchResults[0];
		}
		// If user id was not found
		else {
			throw new Error(EApiErrors.BAD_AUTHENTICATION);
		}
	}

	/**
	 * Login to twitter as guest.
	 *
	 * @returns A new guest key.
	 *
	 * @example
	 * ```
	 * import { Rettiwt } from 'rettiwt-api';
	 *
	 * // Creating a new Rettiwt instance
	 * const rettiwt = new Rettiwt();
	 *
	 * // Logging in an getting a new guest key
	 * rettiwt.auth.guest()
	 * .then(guestKey => {
	 * 	// Use the guest key
	 * 	...
	 * })
	 * .catch(err => {
	 * 	console.log(err);
	 * });
	 * ```
	 */
	public async guest(): Promise<AuthCredential> {
		// Creating a new blank credential
		const cred: AuthCredential = new AuthCredential();

		// Getting the guest token using fetch替代axios
		try {
			const response = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
				method: 'POST',
				headers: cred.toHeader() as any,
				credentials: 'include'
			});
			
			if (response.ok) {
				const data = await response.json();
				cred.guestToken = data.guest_token;
			}
		} catch (error) {
			console.error('Error getting guest token:', error);
		}

		return cred;
	}
}
