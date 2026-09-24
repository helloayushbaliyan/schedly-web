'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BookingInterface({ event, profile, availableDays = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [step, setStep] = useState('calendar') // calendar, details, success
  
  const [guestDetails, setGuestDetails] = useState({ name: '', email: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccessData, setBookingSuccessData] = useState(null)

  // Basic calendar logic
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateSelect = async (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return

    setSelectedDate(date)
    setSelectedSlot(null)
    setLoadingSlots(true)
    setBookingError(null)

    // Format date as YYYY-MM-DD
    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/getAvailableSlots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event_type_id: event.id,
          selected_date: dateStr
        })
      })

      const data = await response.json()
      
      if (data.slots && Array.isArray(data.slots)) {
        setAvailableSlots(data.slots)
      } else {
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
  }

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      setStep('details')
    }
  }

  const handleBookMeeting = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setBookingError(null)

    const dateStr = [
      selectedDate.getFullYear(),
      String(selectedDate.getMonth() + 1).padStart(2, '0'),
      String(selectedDate.getDate()).padStart(2, '0')
    ].join('-')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/createMeeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          event_type_id: event.id,
          selected_date: dateStr,
          selected_slot: selectedSlot.time,
          guest_name: guestDetails.name,
          guest_email: guestDetails.email,
          notes: guestDetails.notes
        })
      })

      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to book meeting')
      }

      setBookingSuccessData(data.meeting)
      setStep('success')
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError(error.message)
      if (error.message.includes('already booked') || error.message.includes('longer available')) {
        // Go back to calendar if double booked
        setStep('calendar')
        handleDateSelect(selectedDate) // refresh slots
      }
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  if (step === 'success') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-[800px] w-full mx-auto">
        <div className="p-8 md:p-12 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting confirmed</h2>
          <p className="text-gray-600 mb-8">You are scheduled with {profile.user_name}.</p>
          
          <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-gray-900">{event.title}</h3>
            <div className="mt-4 flex items-start gap-3 text-gray-600">
              <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                {selectedDate && formatDate(selectedDate)}<br />
                {selectedSlot && `${selectedSlot.time} (Duration: ${event.duration}m)`}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              India Standard Time
            </div>
          </div>

          {bookingSuccessData?.meeting_link && (
            <a 
              href={bookingSuccessData.meeting_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#007AFF] px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
            >
              Join Meeting
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-[max-width] duration-300 ease-in-out w-full mx-auto flex flex-col md:flex-row ${
      step === 'calendar' && selectedDate ? 'max-w-[1050px]' : 'max-w-[800px]'
    }`}>
      {/* LEFT: Event Info Sidebar */}
      <div className="w-full md:w-[320px] md:flex-shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-8">
        <Link href={`/${profile.user_name}`} className="inline-flex items-center text-gray-500 hover:text-gray-900 transition mb-6">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
        
        <h2 className="text-gray-500 font-medium">{profile.user_name}</h2>
        <h1 className="text-2xl font-bold text-gray-900 mt-1 mb-4">{event.title}</h1>
        
        <div className="flex flex-col gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {event.duration} minutes
          </div>
          {event.location_type && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {event.location_type === 'google_meet' ? 'Google Meet' : event.location_type}
            </div>
          )}
        </div>
        
        {event.description && (
          <p className="text-gray-600 mt-6 whitespace-pre-wrap">{event.description}</p>
        )}

        {(selectedDate || step === 'details') && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-2 text-gray-900 font-medium">
              <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                {formatDate(selectedDate)}
                {selectedSlot && <div className="mt-1">{selectedSlot.time}</div>}
              </div>
            </div>
            {(selectedSlot || step === 'details') && (
              <div className="mt-2 text-sm text-gray-500 ml-7">
                India Standard Time
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Calendar or Details Form */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {step === 'calendar' ? (
          <>
            {/* Calendar Block */}
            <div className="p-8 w-full md:w-[480px] md:flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select a Date & Time</h3>
              
              <div className="mb-4 flex items-center justify-between">
                <span className="font-medium text-gray-900">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-[#007AFF]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-[#007AFF]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-medium text-gray-500 py-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, i) => {
                  if (!date) return <div key={i} className="p-2"></div>
                  
                  const isPast = date < new Date().setHours(0,0,0,0)
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                  const isAvailableDay = availableDays.length === 0 || availableDays.includes(dayName)
                  const isDisabled = isPast || !isAvailableDay
                  
                  const isSelected = selectedDate?.toDateString() === date.toDateString()
                  const isToday = new Date().toDateString() === date.toDateString()
                  
                  return (
                    <button
                      key={i}
                      disabled={isDisabled}
                      onClick={() => handleDateSelect(date)}
                      className={`
                        aspect-square p-2 rounded-full flex items-center justify-center text-sm font-medium transition
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 text-gray-700'}
                        ${isSelected ? 'bg-[#007AFF] text-white hover:bg-blue-600' : ''}
                        ${!isSelected && isToday && !isDisabled ? 'text-[#007AFF] bg-blue-50/50' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
              
              <div className="mt-6 text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                India Standard Time
              </div>
            </div>

            {/* Slots Block (slides in / expands) */}
            {selectedDate && (
              <div className="w-full md:w-[250px] md:flex-shrink-0 flex flex-col pt-8 md:pt-8 md:pr-8 animate-fade-in-right md:border-l border-gray-100 pl-0 md:pl-8">
                <div className="text-gray-900 font-medium mb-4">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                
                <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 space-y-2">
                  {loadingSlots ? (
                    <div className="flex flex-col gap-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse w-full"></div>
                      ))}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">
                      No times available
                    </div>
                  ) : (
                    availableSlots.map((slot, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        {!slot.booked ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSlotSelect(slot)}
                              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition border text-center
                                ${selectedSlot === slot 
                                  ? 'bg-gray-600 border-gray-600 text-white w-1/2' 
                                  : 'border-[#007AFF] text-[#007AFF] hover:border-blue-700 bg-white'
                                }
                              `}
                            >
                              {slot.time}
                            </button>
                            {selectedSlot === slot && (
                              <button 
                                onClick={handleContinue}
                                className="flex-1 bg-[#007AFF] hover:bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition text-center w-1/2"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        ) : step === 'details' ? (
          <div className="p-8 w-full">
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start">
                 <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 {bookingError}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-6">Enter Details</h3>
            
            <form onSubmit={handleBookMeeting} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  required
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({...guestDetails, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] outline-none transition text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] outline-none transition text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Please share anything that will help prepare for our meeting.</label>
                <textarea
                  id="notes"
                  rows="4"
                  value={guestDetails.notes}
                  onChange={(e) => setGuestDetails({...guestDetails, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF] outline-none transition resize-none text-gray-900"
                ></textarea>
              </div>
              
              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#007AFF] hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scheduling...
                    </>
                  ) : 'Schedule Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('calendar')}
                  className="text-gray-600 hover:text-gray-900 font-medium transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
