 
import { Link } from 'react-router-dom'
import { useState } from 'react'

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Smooth scroll to sections
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">

      {/* Top Bar with Glass Effect */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl shadow-lg shadow-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          {/* Logo with Enhanced Shadow */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-110 transition-all duration-300">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-base text-gray-900">
              SECURE<span className="text-emerald-600">ATM</span>
            </span>
          </div>

          {/* Desktop Nav with Active States */}
          <nav className="hidden lg:flex items-center gap-8 text-sm text-gray-600">
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 hover:after:w-full after:transition-all">
              About Us
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 hover:after:w-full after:transition-all">
              Features
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 hover:after:w-full after:transition-all">
              How It Works
            </button>
            <Link to="/contact" className="hover:text-emerald-600 transition-all duration-300 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-600 hover:after:w-full after:transition-all">
              Contact
            </Link>

            {/* Register Button with Glow */}
            <Link
              to="/register"
              className="ml-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              Register Now →
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-xl">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
              <button onClick={() => scrollToSection('about')} className="text-left py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                About Us
              </button>
              <button onClick={() => scrollToSection('features')} className="text-left py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                How It Works
              </button>
              <Link to="/contact" className="py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors">
                Contact
              </Link>
              <Link
                to="/register"
                className="mt-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-center shadow-lg hover:shadow-xl transition-all"
              >
                Register Now →
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">

        {/* Hero Section with Image */}
        <section id="about" className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 border border-emerald-100/50 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 shadow-2xl shadow-emerald-500/10 backdrop-blur-sm mb-10 sm:mb-16">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl -z-10" />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Text */}
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-lg shadow-emerald-500/10 mb-5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-xs font-semibold text-emerald-700">Next-Gen Security</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-gray-900">
                Secure Your Transactions.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500">
                  Complete in under 30 seconds.
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
                  Faster. Safer. Smarter.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-lg mb-8 leading-relaxed">
                Experience seamless withdrawals with military-grade encryption and advanced biometric verification. Your security is our priority.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white text-base font-bold shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started Now →
                </Link>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm border-2 border-emerald-500 text-emerald-600 text-base font-bold shadow-xl shadow-emerald-500/10 hover:bg-emerald-50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Image with 3D Effect */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all duration-500 hover:scale-[1.02] transform-gpu">
                {/* Replace with your actual image */}
                <img 
                  src="https://visagetechnologies.com/app/uploads/2023/04/Fingerprint-vs-face-recognition.webp" 
                  alt="Secure ATM biometric authentication"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent mix-blend-overlay" />
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-emerald-500/20 border border-emerald-100/50">
                <div className="text-3xl font-bold text-emerald-600">99.9%</div>
                <div className="text-sm text-gray-600 font-medium">Uptime</div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-teal-500/20 border border-teal-100/50">
                <div className="text-3xl font-bold text-teal-600">&lt;30s</div>
                <div className="text-sm text-gray-600 font-medium">Avg. Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Enhanced Cards */}
        <section id="features" className="bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-gray-900/5 mb-10 sm:mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Why Choose SecureATM?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience banking reimagined with cutting-edge security features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <FeatureCard
              title="Military-Grade Security"
              desc="Bank-level encryption protects every transaction with multiple layers of defense."
              variant="secure"
            />
            <FeatureCard
              title="Lightning Fast"
              desc="Optimized infrastructure ensures instant processing and zero lag time."
              variant="fast"
            />
            <FeatureCard
              title="Biometric Auth"
              desc="Face recognition and fingerprint scanning provide seamless access."
              variant="biometric"
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-white border border-emerald-200/30 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-emerald-500/10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Five simple steps to secure, fast transactions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <Step number="1" title="Register" desc="Create your account using email and phone verification." />
            <Step number="2" title="Setup Biometrics" desc="Register your face and fingerprint securely in our system." />
            <Step number="3" title="Login" desc="Access using PIN, password, or biometric authentication." />
            <Step number="4" title="Verify Transaction" desc="Biometric verification for high-value withdrawals." />
            <Step number="5" title="Withdraw Cash" desc="Complete your withdrawal with instant authorization." />
          </div>
        </section>
      </main>
    </div>
  )
}

/* Enhanced Feature Card Component */
function FeatureCard({ title, desc, variant }) {
  return (
    <div className="group relative bg-gradient-to-br from-white via-white to-gray-50/50 border border-gray-200/50 rounded-2xl p-8 flex flex-col gap-4 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-300/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/10 transition-all duration-500" />
      
      {/* Icon with Enhanced Shadow */}
      <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/40 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 group-hover:scale-110 transition-all duration-500">
        {variant === 'secure' && (
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
        {variant === 'fast' && (
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        {variant === 'biometric' && (
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        )}
      </div>

      <div className="relative">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>

      {/* Hover Arrow */}
      <div className="relative mt-auto">
        <div className="text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn more →
        </div>
      </div>
    </div>
  )
}

/* Enhanced Step Component */
function Step({ number, title, desc }) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/40 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-300 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/0 group-hover:to-emerald-500/5 transition-all duration-500" />
      
      {/* Number Badge */}
      <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-emerald-500/40 group-hover:shadow-2xl group-hover:shadow-emerald-500/60 group-hover:scale-110 transition-all duration-500">
        {number}
      </div>
      
      <div className="relative">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

export default LandingPage
