/**
 * High-level client for Stake Engine RGS API operations
 * 
 * @description
 * This module provides convenient methods for all RGS API operations including
 * authentication, betting, balance checking, and game events. All methods
 * include automatic amount conversion and type safety.
 */

import { fetcher } from './fetcher';
import { API_AMOUNT_MULTIPLIER } from './constants';
import type { paths, components } from './types';

/**
 * Type-safe RGS API client with automatic response parsing
 */
export class StakeEngineClient {
	/**
	 * Make a POST request to the RGS API
	 * 
	 * @param options - Request configuration
	 * @returns Typed response data
	 */
	async post<
		T extends keyof paths,
		TResponse = paths[T]['post']['responses'][200]['content']['application/json'],
	>(options: {
		url: T;
		rgsUrl: string;
		variables?: paths[T]['post']['requestBody']['content']['application/json'];
	}): Promise<TResponse> {
		const response = await fetcher({
			method: 'POST',
			variables: options.variables,
			endpoint: `https://${options.rgsUrl}${options.url}`,
		});

		if (response.status !== 200) {
			console.error('RGS API error:', response.status, response.statusText);
		}
		
		const data = await response.json();
		return data as TResponse;
	}

	/**
	 * Make a GET request to the RGS API
	 * 
	 * @param options - Request configuration
	 * @returns Typed response data
	 */
	async get<T extends keyof paths>(options: { 
		url: T; 
		rgsUrl: string; 
	}): Promise<any> {
		const response = await fetcher({
			method: 'GET',
			endpoint: `https://${options.rgsUrl}${options.url}`,
		});

		if (response.status !== 200) {
			console.error('RGS API error:', response.status, response.statusText);
		}
		
		const data = await response.json();
		return data;
	}
}

/**
 * Default client instance for convenience
 */
export const stakeEngineClient = new StakeEngineClient();

// High-level API methods using the client

/**
 * Authenticate a player session with the RGS
 * 
 * @param options - Authentication parameters
 * @returns Authentication response with balance, config, and active round info
 * 
 * @example
 * ```typescript
 * const auth = await requestAuthenticate({
 *   sessionID: 'player-session-123',
 *   rgsUrl: 'api.stakeengine.com',
 *   language: 'en'
 * });
 * 
 * console.log('Player balance:', auth.balance?.amount);
 * console.log('Available bet levels:', auth.config?.betLevels);
 * ```
 */
export const requestAuthenticate = async (options: {
	sessionID: string;
	rgsUrl: string;
	language: string;
}): Promise<components['schemas']['res_authenticate']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/wallet/authenticate',
		variables: {
			sessionID: options.sessionID,
			language: options.language,
		},
	});
};

/**
 * End the current betting round
 * 
 * @param options - End round parameters
 * @returns Response with updated balance and status
 * 
 * @example
 * ```typescript
 * const result = await requestEndRound({
 *   sessionID: 'player-session-123',
 *   rgsUrl: 'api.stakeengine.com'
 * });
 * 
 * if (result.status?.statusCode === 'SUCCESS') {
 *   console.log('Round ended successfully');
 * }
 * ```
 */
export const requestEndRound = async (options: {
	sessionID: string;
	rgsUrl: string;
}): Promise<components['schemas']['res_end_round']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/wallet/end-round',
		variables: {
			sessionID: options.sessionID,
		},
	});
};

/**
 * Track a game event (for bet progress tracking)
 * 
 * @param options - Event parameters
 * @returns Event response with confirmation
 * 
 * @example
 * ```typescript
 * const result = await requestEndEvent({
 *   sessionID: 'player-session-123',
 *   eventIndex: 1,
 *   rgsUrl: 'api.stakeengine.com'
 * });
 * ```
 */
export const requestEndEvent = async (options: {
	sessionID: string;
	eventIndex: number;
	rgsUrl: string;
}): Promise<components['schemas']['res_event']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/bet/event',
		variables: {
			sessionID: options.sessionID,
			event: `${options.eventIndex}`,
		},
	});
};

/**
 * Search for specific game results (for testing/debugging)
 * 
 * @param options - Search parameters
 * @returns Search results with matching rounds
 * 
 * @example
 * ```typescript
 * const results = await requestForceResult({
 *   mode: 'base',
 *   search: {
 *     bookID: 42,
 *     kind: 1,
 *     symbol: 'BONUS'
 *   },
 *   rgsUrl: 'api.stakeengine.com'
 * });
 * ```
 */
export const requestForceResult = async (options: {
	mode: string;
	search: {
		bookID?: number;
		kind?: number;
		symbol?: string;
		hasWild?: boolean;
		wildMult?: number;
		gameType?: string;
	};
	rgsUrl: string;
}): Promise<components['schemas']['res_search']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/game/search',
		variables: {
			mode: options.mode,
			search: options.search,
		},
	});
};

/**
 * Place a bet and start a new round
 * 
 * @param options - Bet parameters
 * @returns Bet response with round details, balance, and game state
 * 
 * @example
 * ```typescript
 * const bet = await requestBet({
 *   sessionID: 'player-session-123',
 *   currency: 'USD',
 *   amount: 1.00,  // $1.00 (automatically converted to API format)
 *   mode: 'base',
 *   rgsUrl: 'api.stakeengine.com'
 * });
 * 
 * console.log('Round ID:', bet.round?.roundID);
 * console.log('Payout multiplier:', bet.round?.payoutMultiplier);
 * console.log('New balance:', bet.balance?.amount);
 * ```
 */
export const requestBet = async (options: {
	sessionID: string;
	currency: string;
	amount: number;
	mode: string;
	rgsUrl: string;
}): Promise<components['schemas']['res_play']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/wallet/play',
		variables: {
			mode: options.mode,
			currency: options.currency,
			sessionID: options.sessionID,
			amount: options.amount * API_AMOUNT_MULTIPLIER, // Convert to API format
		},
	});
};

/**
 * Get current player balance
 * 
 * @param options - Balance request parameters
 * @returns Current balance information
 * 
 * @example
 * ```typescript
 * const balance = await requestBalance({
 *   sessionID: 'player-session-123',
 *   rgsUrl: 'api.stakeengine.com'
 * });
 * 
 * console.log('Current balance:', balance.balance?.amount, balance.balance?.currency);
 * ```
 */
export const requestBalance = async (options: {
	sessionID: string;
	rgsUrl: string;
}): Promise<components['schemas']['res_Balance']> => {
	return stakeEngineClient.post({
		rgsUrl: options.rgsUrl,
		url: '/wallet/balance',
		variables: {
			sessionID: options.sessionID,
		},
	});
};