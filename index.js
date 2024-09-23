#!/usr/bin/env node

const dirSkip = ['node_modules', '.output', 'dist'];
const keyFile = ['package.json'];
const cmdName = 'each-package-run';

function showHelp() {
  console.error(`🌀 Usage: ${cmdName} [-x skip-dir ...] <from-dir> <command> [...args]`);
  console.error(`🌀 e.g. ${cmdName} -x dir1 -x dir2 ./packages pnpm install`);
  console.error(`🌀 and [node_modules, .output, dist] skipped by default`);
}

const args = process.argv;
if (args.length < 3) {
  showHelp();
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findPackageDirs(dir) {
  let dirsWithPackageJson = [];

  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fn = file.name;
    if (dirSkip.includes(fn)) continue;

    if (file.isDirectory()) {
      const sb = findPackageDirs(path.join(dir, fn));
      dirsWithPackageJson = dirsWithPackageJson.concat(sb);
    } else if (file.isFile() && keyFile.includes(fn)) {
      dirsWithPackageJson.push(dir);
    }
  }

  return dirsWithPackageJson;
}

const excludes = [...dirSkip];
const commands = [];

// const idx = args.findIndex(item => item.endsWith(cmdName) || item.endsWith(`${cmdName}/index.js`));
for (let i = 2; i < args.length; i++) {
  if (args[i] === '-x') {
    excludes.push(args[++i]);
  } else {
    commands.push(args[i]);
  }
}

const fromDir = path.resolve(process.cwd(), commands[0]);
const command = commands.slice(1).join(' ');
console.log(`🌀 FromDir: ${fromDir}`);
console.log(`🌀 Exclude: ${excludes.join(', ')}`);
console.log(`🌀 Command: ${command}`);

if (!fs.existsSync(fromDir) || command === '') {
  showHelp();
  process.exit(1);
}

const pkgDirs = findPackageDirs(fromDir);
console.log(`🌀 FindPkg: ${pkgDirs.length}`);
const st = Date.now();
for (let i = 0; i < pkgDirs.length; i++) {
  const pkg = pkgDirs[i];
  try {
    console.log(`🌀 #${i + 1}. ${pkg}`);
    execSync(command, { cwd: pkg, stdio: 'inherit' });
  } catch (error) {
    console.log(`Error in ${pkg}`);
  }
}

const ct = ((Date.now() - st) / 1000).toFixed(2);
console.log(`🌀 Finished each run, in ${ct}s`);
