import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zevtwyyuybfikdbuebyy.supabase.co',
  'sb_publishable_VUpYV05oZv1Msv0pa4dmSQ_g1PpMqKe'
)

async function testEdgeFunction() {
  console.log('Fetching edge function...')
  const response = await fetch(`https://zevtwyyuybfikdbuebyy.supabase.co/functions/v1/getAvailableSlots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer sb_publishable_VUpYV05oZv1Msv0pa4dmSQ_g1PpMqKe`
    },
    body: JSON.stringify({
      event_type_id: '76f8cccb-1ad9-437b-ae56-2bffd8c23808', // Meeting
      selected_date: '2026-09-30'
    })
  })

  const text = await response.text()
  console.log('Status:', response.status)
  console.log('Response:', text)
}

testEdgeFunction()
