// scripts/check-env.js
// Diagnostic script to check if .env is being loaded

const path = require('path');
const fs = require('fs');

console.log('\n🔍 ENVIRONMENT DIAGNOSTICS\n');
console.log('='.repeat(60));

// Check current directory
console.log('📁 Current Directory:', __dirname);
console.log('📁 Process Directory:', process.cwd());

// Check if .env file exists in root
const rootEnvPath = path.join(__dirname, '..', '.env');
const scriptsEnvPath = path.join(__dirname, '.env');

console.log('\n📄 Checking .env file locations:\n');
console.log('1. Root .env path:', rootEnvPath);
console.log('   Exists:', fs.existsSync(rootEnvPath) ? '✅ YES' : '❌ NO');

console.log('\n2. Scripts .env path:', scriptsEnvPath);
console.log('   Exists:', fs.existsSync(scriptsEnvPath) ? '✅ YES' : '❌ NO');

// Try to load dotenv
console.log('\n🔌 Attempting to load .env file...\n');

try {
  const result = require('dotenv').config({ path: rootEnvPath });
  
  if (result.error) {
    console.log('❌ Error loading .env:', result.error.message);
  } else {
    console.log('✅ .env loaded successfully!');
    console.log('\n📊 Environment Variables:\n');
    console.log('PORT:', process.env.PORT || '❌ NOT SET');
    console.log('NODE_ENV:', process.env.NODE_ENV || '❌ NOT SET');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 
      `✅ SET (${process.env.MONGODB_URI.substring(0, 30)}...)` : 
      '❌ NOT SET');
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 
      `✅ SET (${process.env.JWT_SECRET.substring(0, 20)}...)` : 
      '❌ NOT SET');
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ NOT SET');
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Check if .env file has content
if (fs.existsSync(rootEnvPath)) {
  console.log('\n📄 .env File Contents Preview:\n');
  const content = fs.readFileSync(rootEnvPath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  if (lines.length === 0) {
    console.log('❌ .env file is EMPTY!');
  } else {
    console.log(`✅ Found ${lines.length} variables:`);
    lines.forEach(line => {
      const [key] = line.split('=');
      console.log(`   - ${key.trim()}`);
    });
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n💡 To fix:');
console.log('   1. Ensure .env is in: ' + rootEnvPath);
console.log('   2. Ensure .env has MONGODB_URI=...');
console.log('   3. No quotes around values');
console.log('   4. No spaces around =');
console.log('\n');