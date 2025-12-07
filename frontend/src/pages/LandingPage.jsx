import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* Top Bar */}
      <header className="border-b border-gray-800 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-base">
              SECURE<span className="text-emerald-400">ATM</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-gray-300">
            <button className="hover:text-white transition">About Us</button>
            <button className="hover:text-white transition">Features</button>
            <button className="hover:text-white transition">How It Works</button>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>

            {/* Register Link */}
            <Link
              to="/register"
              className="ml-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold text-sm shadow-lg hover:shadow-emerald-500/50 hover:brightness-110 transition-all"
            >
              Register Now →
            </Link>
          </div>

          {/* Mobile Menu */}
          <button className="lg:hidden p-2 text-gray-400 hover:text-white">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-16">

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1A1A1A]/60 to-[#252525]/60 border border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-sm mb-6 sm:mb-10">
          <div className="grid lg:grid-cols-[1fr,1.2fr] gap-6 lg:gap-8">

            {/* Left Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3 sm:mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Next-Gen Security</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3">
                Secure Your Transactions.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                  Test transactions in under 30 seconds.
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  Faster. Safer. Smarter.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-gray-400 max-w-md mb-4 sm:mb-6 leading-relaxed">
                Complete secure withdrawal anytime, anywhere with advanced biometric verification.
              </p>

              {/* Get Started Button */}
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 text-black text-sm font-bold shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:brightness-110 transition-all"
              >
                Get Started Now →
              </Link>
            </div>

            {/* Right Features */}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

                {/* Card 1 */}
                <FeatureCard
                  title="Secure"
                  desc="Military-grade encryption and hardware."
                  variant="secure"
                />

                {/* Card 2 */}
                <FeatureCard
                  title="Fast"
                  desc="Optimized for instant cash withdrawal."
                  variant="fast"
                />

                {/* Card 3 */}
                <FeatureCard
                  title="Biometric"
                  desc="Face & fingerprint authentication."
                  variant="biometric"
                />

              </div>
            </div>
          </div>
        </section>

        {/* Steps - How it Works */}
        <section className="bg-[#0F0F0F] border border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">How It Works</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <Step number="1" title="Register" desc="Create an account using email and phone." />
            <Step number="2" title="Create Biometric Profile" desc="Register your face & fingerprint securely." />
            <Step number="3" title="Login" desc="Access using PIN, password, or biometrics." />
            <Step number="4" title="Verify High-Value Transactions" desc="Biometric verification for higher limits." />
            <Step number="5" title="Withdraw Cash" desc="Authorize the session and complete withdrawal." />
          </div>
        </section>
      </main>
    </div>
  )
}

/* Mini reusable components */
function FeatureCard({ title, desc, variant }) {
  return (
    <div className="bg-gradient-to-br from-[#1F1F1F] to-[#2A2A2A] border border-[#3F3F3F] rounded-xl p-4 sm:p-6 flex flex-col gap-3">
      {/* Icon circle */}
      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
        {variant === 'secure' && (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {/* Lock icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
        {variant === 'fast' && (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {/* Lightning/bolt icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        )}
        {variant === 'biometric' && (
          <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {/* Biometric / fingerprint-like icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-400">{desc}</p>
    </div>
  )
}

function Step({ number, title, desc }) {
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] border border-[#3A3A3A] rounded-xl p-4 sm:p-5 flex gap-3">
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-bold text-black">
        {number}
      </div>
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-white">{title}</h4>
        <p className="text-xs sm:text-sm text-gray-400">{desc}</p>
      </div>
    </div>
  )
}

export default LandingPage
