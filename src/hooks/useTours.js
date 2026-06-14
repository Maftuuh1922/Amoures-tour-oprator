import { useState, useEffect } from 'react'

// ─── Dummy Tour Data ──────────────────────────────────────────────────────────

export const DUMMY_TOURS = [
  {
    id: 'demo-1',
    title: 'Bali Paradise Escape',
    destination: 'Bali, Indonesia',
    description:
      'Nikmati keindahan Pulau Dewata dengan paket lengkap — pura sakral, sawah Ubud, pantai Seminyak, hingga sunset spektakuler di Tanah Lot. Paket sudah termasuk penginapan bintang 4, guide profesional, dan makan 3x sehari.',
    price: 2500000,
    duration: 5,
    duration_days: 5,
    duration_nights: 4,
    departure_date: '2025-08-15',
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    max_participants: 20,
    quota_available: 14,
    is_active: true,
    rating: 4.9,
  },
  {
    id: 'demo-2',
    title: 'Lombok Eksotis',
    destination: 'Lombok, NTB',
    description:
      'Jelajahi keindahan Gili Trawangan, Pantai Pink, dan Gunung Rinjani yang megah bersama pemandu wisata berpengalaman. Rasakan ketenangan alam Lombok yang masih terjaga keasliannya.',
    price: 2200000,
    duration: 4,
    duration_days: 4,
    duration_nights: 3,
    departure_date: '2025-08-22',
    image_url: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80',
    max_participants: 15,
    quota_available: 8,
    is_active: true,
    rating: 4.8,
  },
  {
    id: 'demo-3',
    title: 'Labuan Bajo Adventure',
    destination: 'Labuan Bajo, NTT',
    description:
      'Berlayar di antara pulau-pulau eksotis, bertemu Komodo langsung di habitatnya, dan menyelam di perairan kristal Taman Nasional Komodo. Pengalaman petualangan kelas dunia yang tak terlupakan.',
    price: 4500000,
    duration: 5,
    duration_days: 5,
    duration_nights: 4,
    departure_date: '2025-09-01',
    image_url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=800&q=80',
    max_participants: 12,
    quota_available: 5,
    is_active: true,
    rating: 4.9,
  },
  {
    id: 'demo-4',
    title: 'Yogyakarta Heritage',
    destination: 'Yogyakarta, Jawa',
    description:
      'Wisata budaya dan sejarah ke Candi Borobudur, Prambanan, Keraton Yogyakarta, dan pengalaman membatik langsung bersama pengrajin lokal. Cocok untuk keluarga dan pecinta budaya.',
    price: 1800000,
    duration: 3,
    duration_days: 3,
    duration_nights: 2,
    departure_date: '2025-09-10',
    image_url: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    max_participants: 25,
    quota_available: 18,
    is_active: true,
    rating: 4.7,
  },
  {
    id: 'demo-5',
    title: 'Raja Ampat Diving Paradise',
    destination: 'Raja Ampat, Papua Barat',
    description:
      'Surga penyelaman dunia dengan biodiversitas laut tertinggi — coral garden, manta ray, wobbegong shark, dan pantai pasir putih yang memukau. Destinasi bucket-list para diver dunia.',
    price: 7500000,
    duration: 7,
    duration_days: 7,
    duration_nights: 6,
    departure_date: '2025-09-20',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    max_participants: 10,
    quota_available: 3,
    is_active: true,
    rating: 5.0,
  },
  {
    id: 'demo-6',
    title: 'Bromo Sunrise Spectacular',
    destination: 'Bromo, Jawa Timur',
    description:
      'Saksikan matahari terbit spektakuler di atas lautan pasir Gunung Bromo dan kawah aktifnya yang menakjubkan. Pengalaman yang akan membekas seumur hidup.',
    price: 1500000,
    duration: 2,
    duration_days: 2,
    duration_nights: 1,
    departure_date: '2025-10-05',
    image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    max_participants: 20,
    quota_available: 12,
    is_active: true,
    rating: 4.8,
  },
]

const DUMMY_TESTIMONIALS = [
  {
    id: 't1',
    package_id: 'demo-1',
    rating: 5,
    comment: 'Paket Bali-nya luar biasa! Semua sudah diatur dengan sangat rapi, guide-nya ramah dan informatif.',
    profiles: { full_name: 'Sari Dewi', avatar_url: null },
  },
  {
    id: 't2',
    package_id: 'demo-1',
    rating: 5,
    comment: 'Pengalaman terbaik keluarga kami. Akan booking lagi untuk paket berikutnya!',
    profiles: { full_name: 'Budi Santoso', avatar_url: null },
  },
  {
    id: 't3',
    package_id: 'demo-3',
    rating: 5,
    comment: 'Labuan Bajo benar-benar surga! Komodo-nya keren banget. Terima kasih Amoures!',
    profiles: { full_name: 'Rina Wulandari', avatar_url: null },
  },
]

// ─── Hooks ────────────────────────────────────────────────────────────────────

import { supabase } from '../lib/supabase'

export function useTours(limit = null) {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTours = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('tour_packages')
        .select('id,title,destination,description,price,duration_days,quota,departure_date,image_url,is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (limit) query = query.limit(limit)

      const { data, error: err } = await query
      if (err) throw err

      // Jika tidak ada data di Supabase, pakai dummy data
      setTours(data && data.length > 0 ? data : DUMMY_TOURS.slice(0, limit || undefined))
    } catch (err) {
      console.error('useTours error:', err)
      setError(err)
      // Fallback ke dummy data jika error
      setTours(limit ? DUMMY_TOURS.slice(0, limit) : DUMMY_TOURS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit])

  return { tours, loading, error, refetch: fetchTours }
}

export function useTour(id) {
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchTour = async () => {
      try {
        setLoading(true)
        const { data, error: err } = await supabase
          .from('tour_packages')
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw err
        setTour(data)
      } catch (err) {
        // Fallback ke dummy data
        const found = DUMMY_TOURS.find((t) => t.id === id) || null
        setTour(found)
        if (!found) setError('Tour not found')
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [id])

  return { tour, loading, error }
}

export function useTestimonials(packageId = null) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = packageId
        ? DUMMY_TESTIMONIALS.filter((t) => t.package_id === packageId)
        : DUMMY_TESTIMONIALS
      setTestimonials(result)
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [packageId])

  return { testimonials, loading }
}
