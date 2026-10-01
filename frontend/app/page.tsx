'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  Utensils,
  Truck,
  Users,
  Building2,
  Calendar,
  Baby,
  HandHeart,
  Shield,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const stats = [
  { label: 'Meals Served', value: '125,430', icon: Utensils },
  { label: 'Food Rescued', value: '89,200 kg', icon: Heart },
  { label: 'Active Donors', value: '1,240', icon: Building2 },
  { label: 'Active Volunteers', value: '3,560', icon: Users },
];

const steps = [
  {
    icon: Utensils,
    title: 'Donate',
    description:
      'Restaurants and event organizers list surplus food with details on quantity, type, and pickup window.',
  },
  {
    icon: Heart,
    title: 'Match',
    description:
      'Our smart matching algorithm connects donations with nearby NGOs and orphanages that need it most.',
  },
  {
    icon: Truck,
    title: 'Pickup',
    description:
      'Volunteers are notified and collect the food from the donor location within the scheduled window.',
  },
  {
    icon: Users,
    title: 'Deliver',
    description:
      'Food is delivered to the recipient organization, where it serves people who need it most.',
  },
];

const roles = [
  {
    icon: Building2,
    title: 'Restaurants',
    description:
      'Turn surplus meals into community impact. List excess food, reduce waste, and feed your neighborhood.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Calendar,
    title: 'Event Organizers',
    description:
      'Weddings, conferences, and parties often have leftover food. Donate it to those who need it.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'NGOs',
    description:
      'Access a steady stream of food donations to support your community programs and meal services.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Baby,
    title: 'Orphanages',
    description:
      'Ensure children in your care receive nutritious meals through regular food donations.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: HandHeart,
    title: 'Volunteers',
    description:
      'Be the bridge between surplus and need. Pick up and deliver food to make a direct impact.',
    color: 'bg-pink-50 text-pink-600',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text">FoodBridge</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#who-can-join"
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Who Can Join
              </a>
              <a
                href="#impact"
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                Impact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-medium text-text-secondary hover:text-primary transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light/40 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary-dark text-sm font-medium rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                Reducing food waste, one meal at a time
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text leading-tight">
                Turn Surplus Food Into{' '}
                <span className="text-primary">Someone&apos;s Next Meal.</span>
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl">
                FoodBridge connects restaurants, event organizers, and NGOs to ensure
                no good food goes to waste. Donate surplus, request food for those in
                need, and track every delivery in real time.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="btn-primary text-base px-6 py-3">
                  <Utensils className="w-5 h-5" />
                  Donate Food
                </Link>
                <Link href="/register" className="btn-secondary text-base px-6 py-3">
                  <Heart className="w-5 h-5 text-danger" />
                  Request Food
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Food safety verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Real-time tracking</span>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-light/40 rounded-3xl rotate-3" />
                <div className="absolute inset-0 bg-surface rounded-3xl shadow-card-hover border border-border flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Utensils className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-text mb-2">
                      Join 1,240+ donors
                    </h3>
                    <p className="text-text-secondary">
                      making a difference every day
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-warning fill-warning"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      Trusted by 500+ organizations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Bar */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-text">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">How FoodBridge Works</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From surplus to served in four simple steps. Our platform handles
              matching, logistics, and tracking so you can focus on making a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <div className="card card-hover p-6 text-center relative z-10">
                  <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section id="who-can-join" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Who Can Join?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Whether you have food to spare or need food for your community,
              FoodBridge has a place for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.title}
                className="card card-hover p-6 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  {role.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {role.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  Learn more
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Food Requests */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full mb-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Emergency Response
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
                  Emergency Food Requests
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  When disaster strikes or urgent needs arise, FoodBridge&apos;s
                  emergency response system kicks in. NGOs can post critical requests
                  that are immediately broadcast to all nearby donors and volunteers.
                </p>
                <ul className="space-y-3">
                  {[
                    'Instant notification to all nearby donors',
                    'Priority matching for urgent requests',
                    'Real-time volunteer coordination',
                    'Direct communication channel',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-text">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-surface rounded-card-lg p-6 border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-text">Active Emergency</div>
                    <div className="text-sm text-text-secondary">Downtown Community Center</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">People affected</span>
                    <span className="font-medium text-text">250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Meals needed</span>
                    <span className="font-medium text-text">500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Needed by</span>
                    <span className="font-medium text-red-600">Tonight 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Status</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Critical
                    </span>
                  </div>
                </div>
                <button className="btn-danger w-full mt-6">
                  Respond to Emergency
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making Every Meal Count */}
      <section id="impact" className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Making Every Meal Count</h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Every donation tracked, every delivery verified, every meal accounted
                for. FoodBridge provides complete transparency and accountability
                so you know exactly how your contribution makes a difference.
              </p>
              <div className="space-y-6">
                {[
                  {
                    title: 'Full Transparency',
                    description:
                      'Track every donation from pickup to delivery with real-time updates and photo verification.',
                  },
                  {
                    title: 'Food Safety First',
                    description:
                      'All donors must follow food safety guidelines. Temperature checks and handling protocols ensure quality.',
                  },
                  {
                    title: 'Community Impact',
                    description:
                      'See the direct impact of your contributions with detailed reports and stories from recipients.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-text-secondary">Delivery success rate</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">2.4M</div>
                <div className="text-sm text-text-secondary">Meals delivered</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">45min</div>
                <div className="text-sm text-text-secondary">Avg. pickup time</div>
              </div>
              <div className="card p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-1">12 tons</div>
                <div className="text-sm text-text-secondary">CO2 saved monthly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of donors, volunteers, and organizations working
                together to eliminate food waste and hunger in our communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Join FoodBridge Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-text">FoodBridge</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                Connecting surplus food with those who need it most. Together, we can
                eliminate food waste and hunger.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Platform</h4>
              <ul className="space-y-2">
                {['How It Works', 'Who Can Join', 'Impact', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text mb-4">Connect</h4>
              <ul className="space-y-2">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-text-secondary hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} FoodBridge. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
