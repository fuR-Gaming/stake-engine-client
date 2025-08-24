// Simple test to verify the package works
const pkg = require('./dist/index.js');

console.log('✅ Package loaded successfully');
console.log('📦 Available exports:', Object.keys(pkg));
console.log('🔢 API_AMOUNT_MULTIPLIER:', pkg.API_AMOUNT_MULTIPLIER);
console.log('📝 Package metadata:', pkg.metadata);

// Test that main functions exist
const requiredExports = [
  'requestAuthenticate',
  'requestBet', 
  'requestBalance',
  'requestEndRound',
  'StakeEngineClient',
  'API_AMOUNT_MULTIPLIER'
];

const missing = requiredExports.filter(name => !(name in pkg));
if (missing.length > 0) {
  console.error('❌ Missing exports:', missing);
  process.exit(1);
} else {
  console.log('✅ All required exports present');
}