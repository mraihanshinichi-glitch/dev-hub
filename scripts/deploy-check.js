#!/usr/bin/env node

/**
 * Pre-deployment check script
 * Verifies that all required files and configurations are ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 DevHub Deployment Check\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Run: npm init'
  },
  {
    name: 'Next.js config exists',
    check: () => fs.existsSync('next.config.js'),
    fix: 'Create next.config.js file'
  },
  {
    name: 'Vercel config exists',
    check: () => fs.existsSync('vercel.json'),
    fix: 'File should be created automatically'
  },
  {
    name: 'Environment template exists',
    check: () => fs.existsSync('.env.local.example'),
    fix: 'Create .env.local.example with required variables'
  },
  {
    name: 'Middleware exists',
    check: () => fs.existsSync('middleware.ts'),
    fix: 'Create middleware.ts for route protection'
  },
  {
    name: 'Build script exists',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.build;
    },
    fix: 'Add "build": "next build" to package.json scripts'
  },
  {
    name: 'Start script exists',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts && pkg.scripts.start;
    },
    fix: 'Add "start": "next start" to package.json scripts'
  },
  {
    name: 'TypeScript config exists',
    check: () => fs.existsSync('tsconfig.json'),
    fix: 'Run: npx tsc --init'
  },
  {
    name: 'Tailwind config exists',
    check: () => fs.existsSync('tailwind.config.ts'),
    fix: 'Run: npx tailwindcss init -p --ts'
  },
  {
    name: 'Environment files in .gitignore',
    check: () => {
      if (!fs.existsSync('.gitignore')) return false;
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      return gitignore.includes('.env*.local') || gitignore.includes('.env.local');
    },
    fix: 'Add .env*.local to .gitignore'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   Fix: ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Ready for deployment.');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub');
  console.log('2. Connect to Vercel');
  console.log('3. Set environment variables');
  console.log('4. Deploy!');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.');
  process.exit(1);
}

console.log('\n📖 See DEPLOYMENT.md for detailed instructions.');