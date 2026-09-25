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
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <h1 className="text-2xl font-bold text-[#1E1B16] mb-2">User not found</h1>
        <p className="text-[#717974] mb-6">The scheduling page you're looking for doesn't exist or is no longer available.</p>
        <Link href="/" className="rounded-full bg-[#1F4E3D] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#053D2A] transition">
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
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-[24px] shadow-sm border border-[#E8E4DE] overflow-hidden">
        <div className="p-8 text-center border-b border-[#E8E4DE]">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.user_name} className="w-20 h-20 rounded-full mx-auto mb-4 border border-[#E8E4DE]" />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-[#EAF2ED] flex items-center justify-center border border-[#E8E4DE] text-3xl font-bold text-[#1F4E3D]">
              {profile.user_name.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-[28px] font-extrabold text-[#053D2A]">{profile.user_name}</h1>
          <p className="text-[#717974] mt-1 font-medium">Welcome to my scheduling page. Please follow the instructions to add an event to my calendar.</p>
        </div>

        <div className="p-8">
          {!hasEvents ? (
            <div className="text-center py-12">
              <h2 className="text-lg font-bold text-[#1E1B16]">No events available</h2>
              <p className="text-[#717974] mt-2 font-medium">This user doesn't currently have any active events available for booking.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {events.map((event) => (
                <Link 
                  key={event.id}
                  href={`/${username}/${event.slug}`}
                  className="group flex flex-col justify-between rounded-[20px] border border-[#ECE7DF] p-6 hover:border-[#053D2A] hover:shadow-md transition bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#1F4E3D]" />
                      <h3 className="text-[17px] font-bold text-[#1E1B16] group-hover:text-[#053D2A] transition">{event.title}</h3>
                    </div>
                    {event.description && <p className="text-[14px] text-[#717974] line-clamp-2 mt-2 mb-4 leading-relaxed font-medium">{event.description}</p>}
                  </div>
                  <div className="text-[14px] font-bold text-[#717974] flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-[#9EA5A0]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.duration} minutes
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-[#FAF7F2] p-4 text-center border-t border-[#E8E4DE]">
          <Link href="/" className="text-[13px] font-bold text-[#9EA5A0] hover:text-[#717974] transition tracking-wide uppercase">
            Powered by Schedly
          </Link>
        </div>
      </div>
    </div>
  )
}
