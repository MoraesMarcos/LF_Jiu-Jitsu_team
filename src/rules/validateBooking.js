// src/rules/validateBooking.js

import { preventRebooking } from './aluno/preventRebooking.js'
import { validateDateRules } from './aluno/dateRules.js'
import { trialLimitRule } from './trialLimitRule.js'
import { checkSlotCapacity } from './aluno/slotCapacity.js'

export function validateBooking({
  hasActiveBooking,   
  phone,              
  classType,          
  date,               
  time,               
  hasCapacity,        
  isTrialStudent,     
  currentTrialCount,  
}) {

  const rebookError = preventRebooking(hasActiveBooking, phone)
  if (rebookError) return rebookError

  const dateError = validateDateRules(date)
  if (dateError) return dateError

  const trialError = trialLimitRule(isTrialStudent, currentTrialCount)
  if (trialError) return trialError

  const capacityError = checkSlotCapacity(hasCapacity, classType, date, time)
  if (capacityError) return capacityError

  return null
}
