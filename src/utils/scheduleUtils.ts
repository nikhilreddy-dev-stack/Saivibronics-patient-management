/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Practitioner, Appointment, DailyWorkingHours } from '../types';

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export type DayOfWeek = typeof DAY_NAMES[number];

/**
 * Get day of week string from YYYY-MM-DD
 */
export function getDayOfWeekFromDate(dateStr: string): DayOfWeek {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return DAY_NAMES[d.getDay()];
}

/**
 * Generate 12-hour formatted time slots given start, end, and duration in minutes
 * e.g., "09:30 AM", "01:00 PM", 20 -> ["09:30 AM - 09:50 AM", ...]
 */
export function generateTimeSlotsForWindow(
  startTimeStr?: string,
  endTimeStr?: string,
  durationMinutes: number = 20
): string[] {
  if (!startTimeStr || !endTimeStr) return [];

  // Parse "09:30 AM" or "09:30"
  function parseTimeToMinutes(t: string): number {
    const isPM = /pm/i.test(t);
    const isAM = /am/i.test(t);
    const clean = t.replace(/[^\d:]/g, '');
    const [hStr, mStr] = clean.split(':');
    let hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr || '0', 10);

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  function formatMinutesTo12Hour(totalMins: number): string {
    let hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    let h12 = hours % 12;
    if (h12 === 0) h12 = 12;
    const mStr = mins.toString().padStart(2, '0');
    const hStr = h12.toString().padStart(2, '0');
    return `${hStr}:${mStr} ${period}`;
  }

  const startMins = parseTimeToMinutes(startTimeStr);
  const endMins = parseTimeToMinutes(endTimeStr);
  const slots: string[] = [];

  let current = startMins;
  while (current + durationMinutes <= endMins) {
    const slotStart = formatMinutesTo12Hour(current);
    const slotEnd = formatMinutesTo12Hour(current + durationMinutes);
    slots.push(`${slotStart} - ${slotEnd}`);
    current += durationMinutes;
  }

  return slots;
}

export interface PractitionerAvailabilityResult {
  isAssignedToClinic: boolean;
  isWorkingDay: boolean;
  isOnLeave: boolean;
  dayName: DayOfWeek;
  daySchedule?: DailyWorkingHours;
  availableSlots: string[];
  occupiedSlots: string[];
  isCapacityReached: boolean;
  unavailabilityReason?: string;
  nextAvailableDates: string[];
}

/**
 * 9-Point availability calculation strictly matching Section 6 requirements:
 * 1. Is practitioner assigned to selected clinic?
 * 2. Is practitioner working on selected date? (checks day of week)
 * 3. Is practitioner available during requested time?
 * 4. Does practitioner provide selected service?
 * 5. Is practitioner on leave?
 * 6. Is selected time blocked?
 * 7. Is appointment slot already occupied?
 * 8. Has max session capacity been reached?
 * 9. Does appointment duration fit working session?
 */
export function calculatePractitionerAvailability(
  practitioner: Practitioner,
  clinicId: string,
  selectedDate: string,
  appointments: Appointment[],
  selectedService?: string
): PractitionerAvailabilityResult {
  const result: PractitionerAvailabilityResult = {
    isAssignedToClinic: false,
    isWorkingDay: false,
    isOnLeave: false,
    dayName: getDayOfWeekFromDate(selectedDate),
    availableSlots: [],
    occupiedSlots: [],
    isCapacityReached: false,
    nextAvailableDates: [],
  };

  // 1. Clinic Assignment check
  const isAssigned =
    practitioner.clinicId === clinicId ||
    (practitioner.assignedClinicIds && practitioner.assignedClinicIds.includes(clinicId));
  result.isAssignedToClinic = !!isAssigned;
  if (!isAssigned) {
    result.unavailabilityReason = `${practitioner.name} is not assigned to this clinic centre.`;
    return result;
  }

  // 4. Service check
  if (
    selectedService &&
    practitioner.servicesOffered &&
    practitioner.servicesOffered.length > 0 &&
    !practitioner.servicesOffered.includes(selectedService)
  ) {
    result.unavailabilityReason = `${practitioner.name} does not provide "${selectedService}".`;
    return result;
  }

  // 5. Leave check
  const schedule = practitioner.schedule;
  if (schedule && schedule.leaveDates && schedule.leaveDates.includes(selectedDate)) {
    result.isOnLeave = true;
    result.unavailabilityReason = `${practitioner.name} is on scheduled seva leave on ${selectedDate}.`;
    result.nextAvailableDates = getNextAvailableDates(practitioner, selectedDate, 3);
    return result;
  }

  // 2. Working Day check
  const dayName = result.dayName;
  const daySchedule = schedule?.weeklySchedule?.[dayName];
  result.daySchedule = daySchedule;

  if (!daySchedule || !daySchedule.isWorkingDay) {
    result.isWorkingDay = false;
    const workingDaysList = practitioner.availableDays.join(', ');
    result.unavailabilityReason = `${practitioner.name} is not scheduled to consult on ${dayName}s. Scheduled working days are: ${workingDaysList}.`;
    result.nextAvailableDates = getNextAvailableDates(practitioner, selectedDate, 3);
    return result;
  }

  result.isWorkingDay = true;

  // Generate morning and afternoon slots
  const duration = daySchedule.slotDurationMinutes || schedule?.consultationDurationMinutes || 20;
  const morningSlots = generateTimeSlotsForWindow(
    daySchedule.morningStart,
    daySchedule.morningEnd,
    duration
  );
  const afternoonSlots = generateTimeSlotsForWindow(
    daySchedule.afternoonStart,
    daySchedule.afternoonEnd,
    duration
  );
  const allGeneratedSlots = [...morningSlots, ...afternoonSlots];

  // 7. Find occupied slots in existing appointments
  const matchingAppointments = appointments.filter(
    (apt) =>
      apt.practitionerName === practitioner.name &&
      apt.date === selectedDate &&
      apt.status !== 'Cancelled'
  );

  const occupiedSlotSet = new Set<string>();
  matchingAppointments.forEach((apt) => {
    occupiedSlotSet.add(apt.timeSlot);
  });

  // Blocked slots
  if (schedule?.blockedSlots) {
    schedule.blockedSlots
      .filter((b) => b.date === selectedDate)
      .forEach((b) => occupiedSlotSet.add(b.timeSlot));
  }

  result.occupiedSlots = Array.from(occupiedSlotSet);

  // 8. Session capacity check
  const maxCap = daySchedule.maxCapacity || 15;
  if (matchingAppointments.length >= maxCap) {
    result.isCapacityReached = true;
    result.unavailabilityReason = `All ${maxCap} consultation slots for ${practitioner.name} on ${selectedDate} are fully booked.`;
    result.nextAvailableDates = getNextAvailableDates(practitioner, selectedDate, 3);
    return result;
  }

  // Filter out occupied slots for available slots
  result.availableSlots = allGeneratedSlots.filter((slot) => !occupiedSlotSet.has(slot));

  if (result.availableSlots.length === 0) {
    result.isCapacityReached = true;
    result.unavailabilityReason = `No appointment slots remaining for ${practitioner.name} on ${selectedDate}.`;
    result.nextAvailableDates = getNextAvailableDates(practitioner, selectedDate, 3);
  }

  return result;
}

/**
 * Suggest next available dates for a practitioner starting after reference date
 */
export function getNextAvailableDates(
  practitioner: Practitioner,
  fromDateStr: string,
  count: number = 3
): string[] {
  const suggestions: string[] = [];
  const [year, month, day] = fromDateStr.split('-').map(Number);
  const current = new Date(year, month - 1, day);

  for (let i = 1; i <= 21 && suggestions.length < count; i++) {
    current.setDate(current.getDate() + 1);
    const nextDateStr = current.toISOString().slice(0, 10);
    const dayOfWeek = DAY_NAMES[current.getDay()];

    const schedule = practitioner.schedule;
    const daySchedule = schedule?.weeklySchedule?.[dayOfWeek];

    if (daySchedule && daySchedule.isWorkingDay) {
      if (!schedule?.leaveDates?.includes(nextDateStr)) {
        suggestions.push(nextDateStr);
      }
    }
  }

  return suggestions;
}
