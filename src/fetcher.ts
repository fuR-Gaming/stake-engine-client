/**
 * Low-level HTTP client for making requests to Stake Engine RGS API
 * 
 * @description
 * This module provides a simple fetch wrapper that handles JSON requests
 * and responses. It supports both GET and POST methods and allows for
 * custom fetch implementations (useful for testing or server environments).
 */

export interface FetcherOptions {
	/** Custom fetch function (optional, defaults to global fetch) */
	fetch?: typeof fetch;
	/** HTTP method */
	method: 'POST' | 'GET';
	/** Full endpoint URL */
	endpoint: string;
	/** Request body variables for POST requests */
	variables?: object;
}

/**
 * Generic HTTP client for API requests
 * 
 * @param options - Configuration for the HTTP request
 * @returns Promise that resolves to the Response object
 * 
 * @example
 * ```typescript
 * const response = await fetcher({
 *   method: 'POST',
 *   endpoint: 'https://api.stakeengine.com/wallet/play',
 *   variables: { sessionID: 'abc123', amount: 1000000 }
 * });
 * ```
 */
export const fetcher = (options: FetcherOptions): Promise<Response> => {
	const { method, endpoint, variables } = options;
	const fetchFn = options.fetch ?? fetch;

	return fetchFn(endpoint, {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		...(method === 'GET' ? {} : { body: JSON.stringify(variables) }),
	});
};