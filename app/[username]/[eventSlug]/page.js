import { supabaseAdmin, getProfileByUsername } from '@/lib/supabase-admin'
import Link from 'next/link'
import BookingInterface from '@/components/booking/BookingInterface'

export const dynamic = 'force-dynamic'

export default async function EventPage({ params }) {
  const { username, eventSlug } = await params

  // Find user flexibly
  const profile = await getProfileByUsername(username)

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <h1 className="text-2xl font-bold text-[#1E1B16] mb-2">User not found</h1>
        <p className="text-[#717974] mb-6">The scheduling page you're looking for doesn't exist or is no longer available.</p>
        <Link href="/" className="rounded-full bg-[#1F4E3D] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#053D2A] transition">
          Go to Schedly
        </Link>
      </div>
    )
  }

  // Find event
  const { data: event, error: eventError } = await supabaseAdmin
    .from('events_types')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('slug', eventSlug)
    .single()

  if (eventError || !event) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <h1 className="text-2xl font-bold text-[#1E1B16] mb-2">Event not found</h1>
        <p className="text-[#717974] mb-6">The event you're looking for doesn't exist or is no longer available.</p>
        <Link href={`/${username}`} className="rounded-full bg-[#1F4E3D] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#053D2A] transition">
          Back to {profile.user_name}'s page
        </Link>
      </div>
    )
  }

  if (!event.is_active) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <h1 className="text-2xl font-bold text-[#1E1B16] mb-2">Event not available</h1>
        <p className="text-[#717974] mb-6">This event is currently not available for booking.</p>
        <Link href={`/${username}`} className="rounded-full bg-[#1F4E3D] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#053D2A] transition">
          Back to {profile.user_name}'s page
        </Link>
      </div>
    )
  }

  // Fetch availability days to grey out unavailable days in calendar
  const { data: availabilityDays } = await supabaseAdmin
    .from('availability_days')
    .select('day')
    .eq('schedule_id', event.availability_id)

  const validDays = availabilityDays ? availabilityDays.map(d => d.day.toLowerCase()) : []

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <BookingInterface event={event} profile={profile} availableDays={validDays} />
    </div>
  )
}
