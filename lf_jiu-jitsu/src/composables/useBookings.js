import { ref } from 'vue'

const STORAGE_KEY = 'lfjj_bookings'
const CAPACITY_PER_SLOT = 4

function loadAll() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function saveAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function useBookings() {
  const bookings = ref(loadAll())

  const getByPhone = (phone) =>
    bookings.value.filter(b => b.phone === phone)

  const hasActiveBooking = (phone) =>
    bookings.value.some(b => b.phone === phone && b.status === 'booked')

  const slotLoad = (classType, date, time) =>
    bookings.value.filter(b =>
      b.classType === classType &&
      b.date === date &&
      b.time === time &&
      b.status === 'booked'
    ).length

  const isSlotTaken = (classType, date, time) =>
    slotLoad(classType, date, time) >= CAPACITY_PER_SLOT

  const hasCapacity = (classType, date, time) =>
    slotLoad(classType, date, time) < CAPACITY_PER_SLOT

  const create = (payload) => {
    const booking = {
      id: crypto.randomUUID(),
      status: 'booked', 
      createdAt: new Date().toISOString(),
      ...payload,
    }
    bookings.value.push(booking)
    saveAll(bookings.value)
    return booking
  }

  const cancel = (id) => {
    const i = bookings.value.findIndex(b => b.id === id)
    if (i >= 0) {
      bookings.value[i].status = 'cancelled'
      saveAll(bookings.value)
    }
  }

  const conclude = (id) => {
    const i = bookings.value.findIndex(b => b.id === id)
    if (i >= 0) {
      bookings.value[i].status = 'attended'
      saveAll(bookings.value)
    }
  }

  return {
    bookings,
    getByPhone,
    hasActiveBooking,
    isSlotTaken,
    hasCapacity,
    slotLoad,
    create,
    cancel,
    conclude,
  }
}
