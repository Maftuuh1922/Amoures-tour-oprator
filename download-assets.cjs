/**
 * download-assets.cjs
 * Jalankan: node download-assets.cjs
 * Download hero image ke public/ agar served dari Vercel CDN (bukan Unsplash)
 * sehingga LCP bisa turun dari 5.4 dtk → <2.5 dtk
 */

const https = require('https')
const http  = require('http')
const fs    = require('fs')
const path  = require('path')

const PUBLIC_DIR = path.join(__dirname, 'public', 'images')

const ASSETS = [
  {
    name: 'hero.webp',
    url:  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=75&fm=webp&auto=format&fit=crop',
    desc: 'Hero background',
  },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file   = fs.createWriteStream(dest)
    const client = url.startsWith('https') ? https : http

    const get = (u) =>
      client.get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close()
          return get(res.headers.location)
        }
        if (res.statusCode !== 200) {
          fs.unlink(dest, () => {})
          return reject(new Error(`HTTP ${res.statusCode} for ${u}`))
        }
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
        file.on('error', (err) => {
          fs.unlink(dest, () => {})
          reject(err)
        })
      }).on('error', reject)

    get(url)
  })
}

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true })

  for (const asset of ASSETS) {
    const dest = path.join(PUBLIC_DIR, asset.name)
    process.stdout.write(`Downloading ${asset.desc} → public/images/${asset.name} ... `)
    try {
      await download(asset.url, dest)
      const size = (fs.statSync(dest).size / 1024).toFixed(0)
      console.log(`✅ ${size} KB`)
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }
  }

  console.log('\nDone! Sekarang jalankan:')
  console.log('  git add public/images && git commit -m "perf: self-host hero image" && git push')
}

main()
