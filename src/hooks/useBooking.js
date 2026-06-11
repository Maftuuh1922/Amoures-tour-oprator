import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'

// ─── In-memory bookings store (dummy) ────────────────────────────────────────

let DUMMY_BOOKINGS = []

function generateBookingCode() {
  const prefix = 'AMR'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// ─── useBooking ───────────────────────────────────────────────────────────────

export function useBooking() {
  const { user } = useAuthStore()

  const createBooking = async ({
    packageId,
    passengerCount,
    totalPrice,
    notes,
    orderMethod,      // 'b2b' | 'retail'
    b2bDetails,       // { companyName, contactPerson, phone, email, npwp, paymentTerm, poNumber }
  }) => {
    if (!user) throw new Error('Anda harus login terlebih dahulu')

    await new Promise((r) => setTimeout(r, 800)) // simulasi latency

    const bookingCode = generateBookingCode()

    const newBooking = {
      id: `booking-${Date.now()}`,
      booking_code: bookingCode,
      user_id: user.id,
      package_id: packageId,
      passenger_count: passengerCount,
      total_price: totalPrice,
      status: 'pending',
      notes: notes || null,
      order_method: orderMethod || 'retail',
      b2b_details: b2bDetails || null,
      created_at: new Date().toISOString(),
      tour_packages: null, // will be enriched in useUserBookings
    }

    DUMMY_BOOKINGS = [newBooking, ...DUMMY_BOOKINGS]
    return newBooking
  }

  const cancelBooking = async (bookingId) => {
    await new Promise((r) => setTimeout(r, 400))
    DUMMY_BOOKINGS = DUMMY_BOOKINGS.map((b) =>
      b.id === bookingId ? { ...b, status: 'cancelled' } : b
    )
  }

  return { createBooking, cancelBooking }
}

// ─── useUserBookings ──────────────────────────────────────────────────────────

export function useUserBookings() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBookings = () => {
    setLoading(true)
    setTimeout(() => {
      try {
        const userBookings = DUMMY_BOOKINGS.filter((b) => b.user_id === user?.id)
        setBookings(userBookings)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  useEffect(() => {
    if (user) fetchBookings()
    else setLoading(false)
  }, [user])

  return { bookings, loading, error, refetch: fetchBookings }
}
