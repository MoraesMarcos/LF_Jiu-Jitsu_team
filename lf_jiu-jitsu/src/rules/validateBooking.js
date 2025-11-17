// src/rules/validateBooking.js
import { preventRebooking } from './preventRebooking'
import { validateDateRules } from './dateRules'
import { trialLimitRule } from './trialLimitRule'
import { checkSlotCapacity } from './slotCapacity'

export function validateBooking({ hasActiveBooking, hasCapacity, getPreviousBookings, form }) {
  const r1 = preventRebooking(hasActiveBooking, form.phone)
  if (r1) return r1

  const r2 = validateDateRules(form.date, form.time)
  if (r2) return r2

  const previous = getPreviousBookings(form.phone)
  const r3 = trialLimitRule(previous)
  if (r3) return r3

  const r4 = checkSlotCapacity(hasCapacity, form.classType, form.date, form.time)
  if (r4) return r4

  return null
}
