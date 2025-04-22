import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video, Users, Shield, Zap, Menu, X, MessageSquare
} from "lucide-react";

// Reusable Button
function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection />

        {/* Image inserted ABOVE Features */}
        <div className="my-8 flex justify-center">
          <img
            src="/IMG_0022.jpg"
            alt="Video Conference Preview"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

// Header
function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video className="h-6 w-6 text-white" />
          </div>
          <span className="font-semibold text-lg">PORTAL</span>
        </a>

        <div className="flex items-center gap-4">
          <Button onClick={() => navigate("/authentication")} className="bg-transparent border border-white hover:bg-white hover:text-black">
            LOG IN
          </Button>

          <Button onClick={() => navigate("/home")} className="bg-transparent border border-white hover:bg-white hover:text-black">
            ENTER AS GUEST
          </Button>

          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// Hero with "Start Meeting"
function HeroSection() {
  const navigate = useNavigate();

  const handleStartMeeting = () => {
    navigate("/home");
  };

  return (
    <section className="py-20 text-center px-4">
      <h1 className="text-4xl font-bold">One app for video meeting and calls</h1>
      <p className="mt-4 text-zinc-400">The easiest way to video conference and meet.</p>
      <div className="mt-6">
        <Button onClick={handleStartMeeting}>Start Meeting</Button>
      </div>
    </section>
  );
}

// Features
function FeaturesSection() {
  return (
    <section className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">FEATURES</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 justify-center">
        <Feature icon={<Users />} title="GROUP CALLS" desc="Connect with multiple people at once." />
        <Feature icon={<Shield />} title="EASE OF USE" desc="Clear and minimalist design for better comprehension." />
        <Feature icon={<Zap />} title="GESTURES" desc="Hand gestures for a more optimal yet fun experience." />
      </div>
    </section>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex flex-col justify-center text-center p-6 h-56 max-w-sm mx-auto border border-zinc-700 rounded-lg shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-transform hover:scale-105">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-zinc-400">{desc}</p>
    </div>
  );
}

// How It Works
// Replace your HowItWorksSection with this new one:

function HowItWorksSection() {
  return (
    <section className="py-10 bg-zinc-900">
      <div className="flex flex-col md:flex-row justify-around px-4">
        {/* How It Works */}
        <div className="max-w-sm w-full text-left mb-10 md:mb-0">
          <h3 className="text-xl font-semibold mb-2">HOW IT WORKS</h3>
          <ol className="space-y-2 list-decimal list-inside text-zinc-300 text-sm">
            <li>Sign up or join a meeting with a link.</li>
            <li>Share your screen and chat.</li>
            <li>End call and save session if needed.</li>
          </ol>
        </div>

        {/* About PORTAL */}
        <div className="max-w-sm w-full text-left">
          <h3 className="text-xl font-semibold mb-2">About PORTAL</h3>
          <ol className="space-y-2 list-decimal list-inside text-zinc-300 text-sm">
            <li>A simple vid-conferencing app.</li>
            <li>Hand gestures as a new feature.</li>
            <li>A volume up and down gesture.</li>
            <li>Video on/off gesture.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

// CTA
function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 text-center">
      <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
      <Button className="mt-4" onClick={() => navigate("/home")}>
        Start Meeting
      </Button>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-6 border-t border-zinc-800 text-center text-zinc-500">
      &copy; {new Date().getFullYear()} PORTAL. All rights reserved.
    </footer>
  );
}

export default LandingPage;
