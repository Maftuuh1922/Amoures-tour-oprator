const https = require('https')

const SUPABASE_URL    = 'pmadqpbjtqnbloywparm.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRxcGJqdHFuYmxveXdwYXJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI0MDU0MiwiZXhwIjoyMDk2ODE2NTQyfQ.qzqyZooiBclAqHwcxPnwI8F6POar0bEOBYOWjF30e5I'
const ADMIN_ID         = '2db9de77-7b66-4c40-b014-488928acef14'

function req(method, path, body, extra = {}) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : ''
    const opts = {
      hostname: SUPABASE_URL,
      path, method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Length': Buffer.byteLength(payload),
        ...extra,
      },
    }
    const r = https.request(opts, (res) => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }) }
        catch { resolve({ status: res.statusCode, body: d }) }
      })
    })
    r.on('error', e => resolve({ status: 0, body: e.message }))
    if (payload) r.write(payload)
    r.end()
  })
}

async function main() {
  console.log('='.repeat(55))
  console.log(' VERIFIKASI DATABASE ADMIN')
  console.log('='.repeat(55))

  // 1. Cek profiles table
  console.log('\n[1] Cek tabel profiles...')
  const profileRes = await req('GET', `/rest/v1/profiles?id=eq.${ADMIN_ID}&select=*`, '')
  console.log('   Status:', profileRes.status)
  if (profileRes.status === 200) {
    console.log('   Data:', JSON.stringify(profileRes.body, null, 2))
    const profile = Array.isArray(profileRes.body) ? profileRes.body[0] : profileRes.body
    if (profile) {
      console.log(`\n   Role saat ini: "${profile.role}"`)
      if (profile.role !== 'admin') {
        console.log('\n   ⚠️  Role bukan admin! Memperbaiki...')
        // Force update role
        const upd = await req('PATCH', `/rest/v1/profiles?id=eq.${ADMIN_ID}`,
          { role: 'admin' },
          { Prefer: 'return=representation' }
        )
        console.log('   Update status:', upd.status)
        console.log('   Updated:', JSON.stringify(upd.body))
      } else {
        console.log('   ✅ Role sudah "admin" — masalah ada di kode frontend')
      }
    } else {
      console.log('\n   ❌ Profile tidak ditemukan! Membuat...')
      const ins = await req('POST', '/rest/v1/profiles',
        { id: ADMIN_ID, full_name: 'Admin Amoures', phone: '08123456789', role: 'admin' },
        { Prefer: 'resolution=merge-duplicates,return=representation' }
      )
      console.log('   Insert status:', ins.status, JSON.stringify(ins.body))
    }
  } else {
    console.log('   ❌ Error:', profileRes.body)
    console.log('\n   Kemungkinan tabel profiles belum dibuat!')
    console.log('   → Jalankan supabase-setup.sql di SQL Editor Supabase')
    console.log('   → URL: https://supabase.com/dashboard/project/pmadqpbjtqnbloywparm/sql\n')

    // Coba buat tabel minimal dan insert
    console.log('   Mencoba buat tabel profiles...')
    // Tidak bisa run DDL via REST, hanya bisa sarankan user
  }

  // 2. Final check auth user
  console.log('\n[2] Cek auth user...')
  const authRes = await req('GET', `/auth/v1/admin/users/${ADMIN_ID}`, '')
  if (authRes.status === 200) {
    console.log(`   Email: ${authRes.body.email}`)
    console.log(`   Confirmed: ${!!authRes.body.email_confirmed_at}`)
    console.log(`   Metadata: ${JSON.stringify(authRes.body.user_metadata)}`)
  }

  console.log('\n' + '='.repeat(55))
  console.log(' SOLUSI:')
  console.log('='.repeat(55))
  console.log(' 1. Pastikan supabase-setup.sql sudah dijalankan')
  console.log(' 2. Cek role di Supabase Table Editor:')
  console.log('    https://supabase.com/dashboard/project/pmadqpbjtqnbloywparm/editor')
  console.log(' 3. Jalankan SQL ini di SQL Editor:')
  console.log(`    UPDATE profiles SET role='admin' WHERE id='${ADMIN_ID}';`)
}

main().catch(console.error)
