import { supabase } from '@/lib/supabase'

export default async function Page() {
  const { data: profiles, error } = await supabase.from('profiles').select('*')
  
  return (
    <div className="p-8 font-mono">
      <h1 className="text-xl font-bold mb-4">All Profiles Debug</h1>
      {error && <div className="text-red-500">{error.message}</div>}
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(profiles, null, 2)}
      </pre>
    </div>
  )
}
