export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* Navigation */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#007AFF] to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">Schedly</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          
          {/* Decorative background gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-70 pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -z-10 opacity-60 pointer-events-none"></div>
          
          <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              Scheduling simplified
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              Meetings without the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-indigo-500">
                back-and-forth.
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg lg:text-xl text-slate-600 leading-relaxed mb-12">
              Schedly is your personal scheduling assistant. It automates the process of finding the perfect time to meet, so you can focus on the work that actually matters.
            </p>
          </div>
        </section>

        {/* How it works section */}
        <section className="py-24 bg-white relative">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How Schedly Works</h2>
              <p className="mt-4 text-lg text-slate-600">Three simple steps to automate your calendar.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute -inset-4 rounded-2xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center mb-6 text-xl font-bold border border-blue-100">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Set your availability</h3>
                <p className="text-slate-600 leading-relaxed">
                  Connect your Google Calendar and define exactly when you're free to take meetings. Add buffer times and set daily limits to protect your time.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute -inset-4 rounded-2xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center mb-6 text-xl font-bold border border-blue-100">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Share your link</h3>
                <p className="text-slate-600 leading-relaxed">
                  Send your personal Schedly link via email or text. Guests will only see the times you're actually available to meet.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute -inset-4 rounded-2xl bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#007AFF] flex items-center justify-center mb-6 text-xl font-bold border border-blue-100">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Get booked</h3>
                <p className="text-slate-600 leading-relaxed">
                  They pick a time, and the event is instantly added to both of your calendars. Google Meet links are generated automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-24 bg-slate-50 border-t border-slate-200/60">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                  Built for professionals who value their time.
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">No Double Booking</h4>
                      <p className="text-slate-600 mt-1">Real-time calendar syncing ensures you never get double-booked.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Seamless Mobile App</h4>
                      <p className="text-slate-600 mt-1">Manage your availability and check your upcoming meetings on the go with the Schedly mobile app.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Google Meet Integration</h4>
                      <p className="text-slate-600 mt-1">Every meeting automatically includes a unique video conferencing link.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-200 p-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500 ease-out z-0"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                    <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl w-full"></div>
                    <div className="h-16 bg-blue-50 border border-blue-100 rounded-xl w-full"></div>
                    <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center md:justify-start gap-4 mb-6 md:mb-0">
            <span className="text-xl font-bold text-slate-900">Schedly</span>
          </div>
          <p className="text-center text-sm leading-5 text-slate-500">
            &copy; {new Date().getFullYear()} Schedly. An automated scheduling platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
