# Vercel Environment Variables Setup

## Cara Tambahkan ke Vercel

1. Buka https://vercel.com/dashboard
2. Pilih project **Amoures-tour-oprator**
3. Klik **Settings** → **Environment Variables**
4. Tambahkan dua variabel berikut:

---

## Variables yang Harus Ditambahkan

### Variable 1
| Field       | Value |
|-------------|-------|
| **Name**    | `VITE_SUPABASE_URL` |
| **Value**   | `https://pmadqpbjtqnbloywparm.supabase.co` |
| **Environment** | ✅ Production  ✅ Preview  ✅ Development |

---

### Variable 2
| Field       | Value |
|-------------|-------|
| **Name**    | `VITE_SUPABASE_ANON_KEY` |
| **Value**   | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRxcGJqdHFuYmxveXdwYXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNDA1NDIsImV4cCI6MjA5NjgxNjU0Mn0.RBDgqjHalN_zhxTQXvLMFi0YDQ_16yQdh6RTMlm9aF4` |
| **Environment** | ✅ Production  ✅ Preview  ✅ Development |

---

## Setelah Tambah Variables

Klik **Redeploy** agar environment variables aktif:
- Vercel Dashboard → Deployments → klik titik tiga (...) → **Redeploy**

---

## Jangan Lupa: Update Site URL di Supabase

1. Buka https://supabase.com/dashboard/project/pmadqpbjtqnbloywparm
2. Authentication → **URL Configuration**
3. **Site URL** → ganti dari `http://localhost:3000` ke URL Vercel Anda
   contoh: `https://amoures-tour-oprator.vercel.app`
4. **Redirect URLs** → tambahkan:
   - `https://amoures-tour-oprator.vercel.app/**`
   - `http://localhost:5173/**`
