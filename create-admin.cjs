/**
 * create-admin.cjs
 * Jalankan: node create-admin.cjs
 *
 * Script ini akan:
 * 1. Membuat akun admin di Supabase Auth
 * 2. Membuat/update profil dengan role='admin'
 */

const https = require('https')

const SUPABASE_URL    = 'pmadqpbjtqnbloywparm.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRxcGJqdHFuYmxveXdwYXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI0MDU0MiwiZXhwIjoyMDk2ODE2NTQyfQ.qzqyZooiBclAqHwcxPnwI8F6POar0bEOBYOWjF30e5I'

// ── Kredensial admin yang akan dibuat ──────────────────────────────────────
const ADMIN_EMAIL    = 'admin@moures.com'
const ADMIN_PASSWORD = 'Admin@Amoures2024!'
const ADMIN_NAME     = 'Admin Amoures'

// ── Helper: HTTP request ────────────────────────────────────────────────────
function request(method, path, body, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body)
    const options = {
      hostname: SUPABASE_URL,
      path,
      method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey':        SERVICE_ROLE_KEY,
        'Content-Length': Buffer.byteLength(payload),
        ...extraHeaders,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) })
        } catch {
          resolve({ status: res.statusCode, body: data })
        }
      })
    })

    req.on('error', reject)
    req.write(payload)
    req.end()
  })
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('='.repeat(55))
  console.log(' AMOURES TOUR — Setup Admin Account')
  console.log('='.repeat(55))

  // ── STEP 1: Buat user di Supabase Auth ─────────────────────────────────
  console.log('\n[1/3] Membuat akun admin di Supabase Auth...')
  const createRes = await request('POST', '/auth/v1/admin/users', {
    email:         ADMIN_EMAIL,
    password:      ADMIN_PASSWORD,
    email_confirm: true,          // langsung verified, tidak perlu cek email
    user_metadata: { full_name: ADMIN_NAME },
  })

  let adminId = null

  if (createRes.status === 200 || createRes.status === 201) {
    adminId = createRes.body.id
    console.log(`   ✅ User berhasil dibuat! ID: ${adminId}`)
  } else if (createRes.status === 422 && createRes.body?.msg?.includes('already')) {
    // User sudah ada, cari ID-nya
    console.log('   ⚠️  User sudah ada. Mengambil ID yang ada...')
    const listRes = await request('GET', `/auth/v1/admin/users?email=${encodeURIComponent(ADMIN_EMAIL)}`, {})
    if (listRes.status === 200 && listRes.body?.users?.length > 0) {
      adminId = listRes.body.users[0].id
      console.log(`   ✅ ID ditemukan: ${adminId}`)
    } else {
      // Try page-based list
      const list2Res = await request('GET', '/auth/v1/admin/users', {})
      if (list2Res.body?.users) {
        const found = list2Res.body.users.find(u => u.email === ADMIN_EMAIL)
        if (found) {
          adminId = found.id
          console.log(`   ✅ ID ditemukan: ${adminId}`)
        }
      }
    }
  } else {
    console.error('   ❌ Error:', createRes.status, JSON.stringify(createRes.body))
    process.exit(1)
  }

  if (!adminId) {
    console.error('   ❌ Gagal mendapatkan admin ID')
    process.exit(1)
  }

  // ── STEP 2: Buat / update profil dengan role='admin' ───────────────────
  console.log('\n[2/3] Mengatur role admin di tabel profiles...')
  const profileRes = await request(
    'POST',
    '/rest/v1/profiles',
    {
      id:        adminId,
      full_name: ADMIN_NAME,
      phone:     '08123456789',
      role:      'admin',
    },
    {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    }
  )

  if (profileRes.status === 200 || profileRes.status === 201 || profileRes.status === 204) {
    console.log('   ✅ Profil admin berhasil diset!')
  } else if (profileRes.status === 404 || (profileRes.body?.code === '42P01')) {
    console.log('   ⚠️  Tabel profiles belum ada!')
    console.log('   → Jalankan supabase-setup.sql di Supabase SQL Editor dulu,')
    console.log('     lalu jalankan script ini lagi.')
  } else {
    console.log('   ⚠️  Profile response:', profileRes.status, JSON.stringify(profileRes.body))
    console.log('   → Mungkin tabel belum dibuat. Jalankan supabase-setup.sql terlebih dahulu.')
  }

  // ── STEP 3: Verifikasi ──────────────────────────────────────────────────
  console.log('\n[3/3] Verifikasi...')
  const verifyRes = await request('GET', `/auth/v1/admin/users/${adminId}`, {})
  if (verifyRes.status === 200) {
    console.log(`   ✅ Akun terverifikasi: ${verifyRes.body.email}`)
    console.log(`   ✅ Email confirmed: ${verifyRes.body.email_confirmed_at ? 'Ya' : 'Tidak'}`)
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(55))
  console.log(' ✅ SELESAI! Kredensial Login Admin:')
  console.log('='.repeat(55))
  console.log(` Email    : ${ADMIN_EMAIL}`)
  console.log(` Password : ${ADMIN_PASSWORD}`)
  console.log(` URL      : https://amoures-tour-oprator.vercel.app/login`)
  console.log('='.repeat(55))
  console.log('\n PENTING: Simpan password ini di tempat aman!')
  console.log(' Setelah login, masuk ke /admin untuk Admin Panel.\n')
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
