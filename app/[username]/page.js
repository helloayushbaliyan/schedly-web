import { supabaseAdmin, getProfileByUsername } from '@/lib/supabase-admin'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function UserPage({ params }) {
  const { username } = await params

  // Find user flexibly (by email prefix, name, etc.)
  const profile = await getProfileByUsername(username)

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
        <p className="text-gray-600 mb-6">The scheduling page you're looking for doesn't exist or is no longer available.</p>
        <Link href="/" className="rounded-full bg-[#007AFF] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition">
          Go to Schedly
        </Link>
      </div>
    )
  }

  // Find active events for user
  const { data: events, error: eventsError } = await supabaseAdmin
    .from('events_types')
    .select('*')
    .eq('user_id', profile.user_id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const hasEvents = events && events.length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center border-b border-gray-100">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.user_name} className="w-20 h-20 rounded-full mx-auto mb-4 border border-gray-200" />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gray-100 flex items-center justify-center border border-gray-200 text-3xl font-bold text-gray-400">
              {profile.user_name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">{profile.user_name}</h1>
          <p className="text-gray-500 mt-1">Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.</p>
        </div>

        <div className="p-8">
          {!hasEvents ? (
            <div className="text-center py-12">
              <h2 className="text-lg font-medium text-gray-900">No events available</h2>
              <p className="text-gray-500 mt-2">This user doesn't currently have any active events available for booking.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((event) => (
                <Link 
                  key={event.id}
                  href={`/${username}/${event.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-gray-200 p-6 hover:border-[#007AFF] hover:shadow-md transition bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#007AFF]" />
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#007AFF] transition">{event.title}</h3>
                    </div>
                    {event.description && <p className="text-sm text-gray-500 line-clamp-2 mt-2 mb-4">{event.description}</p>}
                  </div>
                  <div className="text-sm font-medium text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.duration} minutes
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
            Powered by Schedly
          </Link>
        </div>
      </div>
    </div>
  )
}
