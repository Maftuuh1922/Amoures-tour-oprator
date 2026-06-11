/**
 * fix-install.js
 * Completes a partial npm install by:
 * 1. Replacing corrupt esbuild binary with correct one
 * 2. Renaming all staged (@esbuild/.NAME-HASH) dirs to final names
 * 3. Creating .bin CMD scripts for all packages that need them
 */

const fs = require('fs')
const path = require('path')

const ROOT = __dirname
const NM = path.join(ROOT, 'node_modules')

// ─── 1. Fix esbuild win32-x64 binary ──────────────────────────────────────
const correctBinary = path.join(ROOT, 'esbuild-extract', 'package', 'esbuild.exe')
const esbuildScope = path.join(NM, '@esbuild')

// Find the win32-x64 staging dir (or final dir)
let win32Dir = null
for (const entry of fs.readdirSync(esbuildScope)) {
  if (entry === 'win32-x64' || entry.startsWith('.win32-x64-')) {
    win32Dir = path.join(esbuildScope, entry)
    break
  }
}

if (win32Dir) {
  const destExe = path.join(win32Dir, 'esbuild.exe')
  fs.copyFileSync(correctBinary, destExe)
  const size = fs.statSync(destExe).size
  console.log(`✓ Replaced esbuild.exe in ${path.basename(win32Dir)} (${(size/1024/1024).toFixed(1)} MB)`)

  // Create package.json if missing
  const pkgJson = path.join(win32Dir, 'package.json')
  if (!fs.existsSync(pkgJson)) {
    fs.writeFileSync(pkgJson, JSON.stringify({
      name: '@esbuild/win32-x64',
      version: '0.21.5',
      description: 'The win32-x64 binary for esbuild',
      os: ['win32'],
      cpu: ['x64'],
      main: 'esbuild.exe',
      engines: { node: '>=12' }
    }, null, 2))
    console.log('✓ Created @esbuild/win32-x64/package.json')
  }
} else {
  console.log('✗ Could not find win32-x64 staging dir')
}

// ─── 2. Rename all staged @esbuild dirs ────────────────────────────────────
for (const entry of fs.readdirSync(esbuildScope)) {
  if (entry.startsWith('.')) {
    // Format: .NAME-RANDOMHASH → NAME
    const dashIdx = entry.lastIndexOf('-')
    if (dashIdx === -1) continue
    const finalName = entry.slice(1, dashIdx) // strip leading dot and trailing -HASH
    const stagingPath = path.join(esbuildScope, entry)
    const finalPath = path.join(esbuildScope, finalName)

    // Create package.json if missing (required for npm to recognize the package)
    const pkgJson = path.join(stagingPath, 'package.json')
    if (!fs.existsSync(pkgJson)) {
      fs.writeFileSync(pkgJson, JSON.stringify({
        name: `@esbuild/${finalName}`,
        version: '0.21.5',
        description: `The ${finalName} binary for esbuild`,
        main: `esbuild${finalName.includes('win') ? '.exe' : ''}`,
        engines: { node: '>=12' }
      }, null, 2))
    }

    if (!fs.existsSync(finalPath)) {
      fs.renameSync(stagingPath, finalPath)
      console.log(`✓ Renamed @esbuild/${entry} → @esbuild/${finalName}`)
    } else {
      // Final dir already exists, merge or skip
      console.log(`  @esbuild/${finalName} already exists, removing staging dir`)
      fs.rmSync(stagingPath, { recursive: true, force: true })
    }
  }
}

// ─── 3. Create .bin directory and CMD scripts ──────────────────────────────
const binDir = path.join(NM, '.bin')
if (!fs.existsSync(binDir)) fs.mkdirSync(binDir)

// Map of bin-name → { package, binFile }
const binEntries = [
  { bin: 'vite',          pkg: 'vite',           rel: 'bin/vite.js' },
  { bin: 'react-router',  pkg: 'react-router-dom',rel: null }, // no bin
  { bin: 'eslint',        pkg: 'eslint',          rel: 'bin/eslint.js' },
  { bin: 'postcss',       pkg: 'postcss-cli',     rel: null },
  { bin: 'tailwindcss',   pkg: 'tailwindcss',     rel: 'lib/cli.js' },
  { bin: 'esbuild',       pkg: 'esbuild',         rel: 'bin/esbuild' },
]

for (const { bin, pkg, rel } of binEntries) {
  if (!rel) continue
  const pkgDir = path.join(NM, pkg)
  if (!fs.existsSync(pkgDir)) continue

  const binFile = path.join(pkgDir, rel)
  if (!fs.existsSync(binFile)) {
    // Try reading from package.json bin field
    try {
      const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
      const binPath = typeof pkgJson.bin === 'string' ? pkgJson.bin :
                      pkgJson.bin?.[bin]
      if (!binPath) continue
      const actualBin = path.join(pkgDir, binPath)
      if (!fs.existsSync(actualBin)) continue
      createCmdScript(binDir, bin, actualBin)
    } catch {}
    continue
  }
  createCmdScript(binDir, bin, binFile)
}

// Also scan all packages for their bin entries
console.log('\nScanning all packages for bin entries...')
for (const entry of fs.readdirSync(NM)) {
  if (entry.startsWith('.') || entry.startsWith('@')) continue
  const pkgJsonPath = path.join(NM, entry, 'package.json')
  if (!fs.existsSync(pkgJsonPath)) continue
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    if (!pkg.bin) continue
    const bins = typeof pkg.bin === 'string'
      ? { [pkg.name.replace(/^.*\//, '')]: pkg.bin }
      : pkg.bin
    for (const [binName, binRel] of Object.entries(bins)) {
      const binPath = path.join(NM, entry, binRel)
      if (fs.existsSync(binPath)) {
        createCmdScript(binDir, binName, binPath)
      }
    }
  } catch {}
}

// Scan scoped packages too
for (const scope of fs.readdirSync(NM)) {
  if (!scope.startsWith('@')) continue
  const scopeDir = path.join(NM, scope)
  try {
    for (const entry of fs.readdirSync(scopeDir)) {
      if (entry.startsWith('.')) continue
      const pkgJsonPath = path.join(scopeDir, entry, 'package.json')
      if (!fs.existsSync(pkgJsonPath)) continue
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        if (!pkg.bin) continue
        const bins = typeof pkg.bin === 'string'
          ? { [pkg.name.replace(/^.*\//, '')]: pkg.bin }
          : pkg.bin
        for (const [binName, binRel] of Object.entries(bins)) {
          const binPath = path.join(scopeDir, entry, binRel)
          if (fs.existsSync(binPath)) {
            createCmdScript(binDir, binName, binPath)
          }
        }
      } catch {}
    }
  } catch {}
}

function createCmdScript(binDir, name, targetJs) {
  const cmdPath = path.join(binDir, name + '.cmd')
  const shPath  = path.join(binDir, name)

  // .cmd for Windows
  const cmdContent = `@ECHO off\r\nGOTO start\r\n:find_dp0\r\nSET dp0=%~dp0\r\nEXIT /b\r\nCALL :find_dp0\r\n:start\r\nSETLOCAL\r\nSET "_prog=%dp0%\\node.exe"\r\nIF NOT EXIST "%_prog%" SET "_prog=node"\r\nIF NOT EXIST "%_prog%" GOTO :no_node\r\n"%_prog%"  "${targetJs.replace(/\\/g, '\\\\')}" %*\r\nGOTO :EOF\r\n:no_node\r\nECHO node is not found in PATH\r\nEXIT /b 1\r\n`

  // For vite.cmd specifically, use a simpler format
  const simpleCmdContent = `@echo off\nnode "${targetJs.replace(/\\/g, '\\\\')}" %*\n`

  if (!fs.existsSync(cmdPath)) {
    fs.writeFileSync(cmdPath, simpleCmdContent)
    console.log(`  ✓ Created .bin/${name}.cmd`)
  }

  // sh script for bash compatibility
  if (!fs.existsSync(shPath)) {
    const shContent = `#!/bin/sh\nnode "${targetJs.replace(/\\/g, '/')}" "$@"\n`
    fs.writeFileSync(shPath, shContent)
    try { fs.chmodSync(shPath, 0o755) } catch {}
  }
}

console.log('\n✅ Fix complete! Try: node node_modules/vite/bin/vite.js')
