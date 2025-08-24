# Stake Engine Client

> Lightweight TypeScript client extracted from [Stake Engine web-sdk](https://github.com/StakeEngine/web-sdk) for RGS (Remote Gaming Server) API communication. Contains only essential backend communication code without Svelte dependencies or slot game scripts.

## Features

- 🚀 **Lightweight**: Only essential RGS communication code
- 📱 **Framework Agnostic**: Works with any JavaScript framework
- 🔒 **Type Safe**: Full TypeScript support with auto-generated types
- 🎯 **Simple API**: High-level methods for common operations
- 🔧 **Configurable**: Low-level access for custom implementations
- 💰 **Smart Conversion**: Automatic amount conversion between formats

## Installation

```bash
npm install stake-engine-client
```

## Quick Start

```typescript
import { requestAuthenticate, requestBet } from 'stake-engine-client';

// Authenticate player
const auth = await requestAuthenticate({
  sessionID: 'player-session-123',
  rgsUrl: 'api.stakeengine.com',
  language: 'en'
});

console.log('Player balance:', auth.balance?.amount);
console.log('Available bet levels:', auth.config?.betLevels);

// Place a bet
const bet = await requestBet({
  sessionID: 'player-session-123',
  currency: 'USD',
  amount: 1.00, // $1.00 (automatically converted)
  mode: 'base',
  rgsUrl: 'api.stakeengine.com'
});

console.log('Round ID:', bet.round?.roundID);
console.log('Payout multiplier:', bet.round?.payoutMultiplier);
```

## API Reference

### Authentication

#### `requestAuthenticate(options)`

Authenticate a player session with the RGS.

```typescript
const auth = await requestAuthenticate({
  sessionID: string,
  rgsUrl: string,
  language: string
});
```

**Returns:** `AuthenticateResponse`
- `balance` - Player's current balance
- `config` - Game configuration including bet levels
- `round` - Active round information (if any)
- `status` - Operation status

### Betting

#### `requestBet(options)`

Place a bet and start a new round.

```typescript
const bet = await requestBet({
  sessionID: string,
  currency: string,
  amount: number,      // Dollar amount (e.g., 1.00 for $1)
  mode: string,        // Bet mode (e.g., 'base')
  rgsUrl: string
});
```

**Returns:** `PlayResponse`
- `round` - Round details including payout and multiplier
- `balance` - Updated player balance
- `status` - Operation status

#### `requestEndRound(options)`

End the current betting round.

```typescript
const result = await requestEndRound({
  sessionID: string,
  rgsUrl: string
});
```

### Balance Management

#### `requestBalance(options)`

Get current player balance.

```typescript
const balance = await requestBalance({
  sessionID: string,
  rgsUrl: string
});
```

### Game Events

#### `requestEndEvent(options)`

Track a game event for bet progress.

```typescript
const result = await requestEndEvent({
  sessionID: string,
  eventIndex: number,
  rgsUrl: string
});
```

### Testing & Debugging

#### `requestForceResult(options)`

Search for specific game results (useful for testing).

```typescript
const results = await requestForceResult({
  mode: string,
  search: {
    bookID?: number,
    kind?: number,
    symbol?: string,
    hasWild?: boolean,
    wildMult?: number,
    gameType?: string
  },
  rgsUrl: string
});
```

## Advanced Usage

### Custom Client Instance

```typescript
import { StakeEngineClient } from 'stake-engine-client';

const client = new StakeEngineClient();

// Make custom API calls with full type safety
const response = await client.post({
  url: '/wallet/authenticate',
  rgsUrl: 'api.stakeengine.com',
  variables: {
    sessionID: 'player-123',
    language: 'en'
  }
});
```

### Low-level HTTP Client

```typescript
import { fetcher } from 'stake-engine-client';

const response = await fetcher({
  method: 'POST',
  endpoint: 'https://api.stakeengine.com/wallet/play',
  variables: { sessionID: 'abc123', amount: 1000000 }
});

const data = await response.json();
```

### Amount Conversion

The client automatically handles amount conversion between different formats:

```typescript
import { API_AMOUNT_MULTIPLIER, BOOK_AMOUNT_MULTIPLIER } from 'stake-engine-client';

// API format: 1,000,000 = $1.00
const apiAmount = 1.00 * API_AMOUNT_MULTIPLIER; // 1000000

// Book format: 100 = $1.00  
const bookAmount = 1.00 * BOOK_AMOUNT_MULTIPLIER; // 100
```

## Type Definitions

The package includes comprehensive TypeScript definitions:

```typescript
import type {
  StatusCode,
  BalanceObject,
  RoundDetailObject,
  ConfigObject,
  AuthenticateResponse,
  PlayResponse,
  BetType,
  BaseBetType
} from 'stake-engine-client';
```

### Status Codes

The RGS API returns standard status codes:

- `SUCCESS` - Operation completed successfully
- `ERR_IPB` - Insufficient player balance
- `ERR_IS` - Invalid session token/timeout
- `ERR_ATE` - Authentication failed/expired
- `ERR_GLE` - Gambling limits exceeded
- `ERR_BNF` - Bet not found
- `ERR_UE` - Unknown server error
- And more...

### Bet Types

For game-specific betting logic:

```typescript
interface MyGameEvent {
  symbol: string;
  multiplier: number;
  position: [number, number];
}

type MyGameBet = BetType<MyGameEvent>;

// Use in your game logic
const processBet = (bet: MyGameBet) => {
  bet.state.forEach(event => {
    console.log(`Symbol ${event.symbol} at ${event.position}`);
  });
};
```

## Error Handling

All methods return responses with status information:

```typescript
const bet = await requestBet({
  sessionID: 'player-123',
  currency: 'USD',
  amount: 1.00,
  mode: 'base',
  rgsUrl: 'api.stakeengine.com'
});

if (bet.status?.statusCode === 'SUCCESS') {
  // Handle successful bet
  console.log('Bet placed successfully!');
} else if (bet.status?.statusCode === 'ERR_IPB') {
  // Handle insufficient balance
  console.log('Insufficient balance');
} else {
  // Handle other errors
  console.log('Error:', bet.status?.statusMessage);
}
```

## Package Extraction

This package was extracted from the official [Stake Engine web-sdk](https://github.com/StakeEngine/web-sdk) to provide:

✅ **Included:**
- RGS API client with full type safety
- Authentication and session management
- Betting and balance operations
- Game event tracking
- Amount conversion utilities
- TypeScript definitions

❌ **Removed:**
- Svelte framework dependencies
- Slot game specific scripts
- UI components and styling
- Audio/visual effects
- Game-specific logic

This makes the package much lighter and suitable for any JavaScript framework or backend usage.

## License

MIT

## Contributing

This package is extracted from Stake Engine web-sdk. For updates to the core functionality, please refer to the [original repository](https://github.com/StakeEngine/web-sdk).

For issues specific to this extraction or TypeScript definitions, please file issues in this repository.