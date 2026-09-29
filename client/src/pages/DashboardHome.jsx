import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Clock3, Droplets, Leaf, MapPin, Plus, RefreshCw, Truck, UtensilsCrossed, Users } from 'lucide-react'
import api from '../services/api'
import { SectionTitle, StatCard, StatusBadge } from '../components/UI'

const emptyDonation = {
  donorName: '',
  phone: '',
  foodName: '',
  category: 'Cooked Food',
  quantity: 10,
  servings: 10,
  preparationTime: '',
  expiryTime: '',
  pickupAddress: '',
  city: '',
  latitude: 18.5204,
  longitude: 73.8567,
  image: '',
  description: ''
}

const emptyRequest = {
  requesterName: '',
  organizationName: '',
  phone: '',
  foodRequired: 'Cooked Food',
  quantityRequired: 10,
  servingsRequired: 10,
  address: '',
  city: '',
  latitude: 18.5204,
  longitude: 73.8567,
  urgency: 'Normal',
  description: ''
}

const emptyDelivery = {
  donationId: '',
  requestId: '',
  volunteerName: '',
  volunteerPhone: ''
}

const heroFlow = [
  'A donor submits surplus food',
  'The system matches food with a nearby request',
  'A volunteer is assigned for pickup and drop',
  'Delivery is marked complete and counted in analytics'
]

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export default function DashboardHome() {
  const [stats, setStats] = useState([])
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [matches, setMatches] = useState([])
  const [deliveries, setDeliveries] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [donationForm, setDonationForm] = useState(emptyDonation)
  const [requestForm, setRequestForm] = useState(emptyRequest)
  const [deliveryForm, setDeliveryForm] = useState(emptyDelivery)

  async function loadData() {
    setLoading(true)
    try {
      const [analyticsRes, donationsRes, requestsRes, matchesRes, deliveriesRes] = await Promise.all([
        api.get('/analytics'),
        api.get('/donations'),
        api.get('/requests'),
        api.get('/matches'),
        api.get('/deliveries')
      ])

      const analytics = analyticsRes.data.data || {}
      setStats([
        { label: 'Total Donations', value: analytics.totalFoodDonations ?? 0 },
        { label: 'Open Requests', value: analytics.totalRequests ?? 0 },
        { label: 'Deliveries', value: analytics.completedDeliveries ?? 0 },
        { label: 'People Served', value: analytics.peopleServed ?? 0 }
      ])
      setDonations(donationsRes.data.data?.donations || [])
      setRequests(requestsRes.data.data?.requests || [])
      setMatches(matchesRes.data.data?.matches || [])
      setDeliveries(deliveriesRes.data.data?.deliveries || [])
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function submitDonation(event) {
    event.preventDefault()
    setMessage('')
    await api.post('/donations', donationForm)
    setDonationForm(emptyDonation)
    await loadData()
    setMessage('Donation saved successfully')
  }

  async function submitRequest(event) {
    event.preventDefault()
    setMessage('')
    await api.post('/requests', requestForm)
    setRequestForm(emptyRequest)
    await loadData()
    setMessage('Request saved successfully')
  }

  async function generateMatches() {
    setMessage('')
    const response = await api.post('/matches')
    setMatches(response.data.data?.matches || [])
    setMessage('Matches refreshed')
  }

  async function assignDelivery(event) {
    event.preventDefault()
    setMessage('')
    await api.post('/deliveries', deliveryForm)
    setDeliveryForm(emptyDelivery)
    await loadData()
    setMessage('Delivery assigned successfully')
  }

  const topMatches = useMemo(() => matches.slice(0, 4), [matches])

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-600 p-8 text-white shadow-soft lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Leaf className="h-4 w-4" /> Public, no-login food donation system
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">FoodBridge</h1>
            <p className="mt-4 max-w-2xl text-white/90">
              A simple B.Tech final-year project for donating surplus food, matching nearby requests, assigning volunteers, and tracking delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
              <span className="rounded-full border border-white/20 px-4 py-2">Donate</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Match</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Deliver</span>
              <span className="rounded-full border border-white/20 px-4 py-2">Analytics</span>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-5 backdrop-blur">
            <div className="space-y-4">
              {heroFlow.map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-brand-700">{index + 1}</div>
                  <p className="text-sm text-white/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {message ? <div className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => <StatCard key={item.label} {...item} />)}
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={loadData} className="btn-secondary inline-flex items-center gap-2" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh data
        </button>
        <button onClick={generateMatches} className="btn-primary inline-flex items-center gap-2">
          <ArrowRight className="h-4 w-4" /> Generate matches
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-6">
          <SectionTitle eyebrow="Donation" title="Add surplus food" description="Enter a public donation record. No sign-in is needed." />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitDonation}>
            <input className="input sm:col-span-1" placeholder="Donor name" value={donationForm.donorName} onChange={(event) => setDonationForm({ ...donationForm, donorName: event.target.value })} />
            <input className="input sm:col-span-1" placeholder="Phone" value={donationForm.phone} onChange={(event) => setDonationForm({ ...donationForm, phone: event.target.value })} />
            <input className="input sm:col-span-2" placeholder="Food name" value={donationForm.foodName} onChange={(event) => setDonationForm({ ...donationForm, foodName: event.target.value })} />
            <select className="input" value={donationForm.category} onChange={(event) => setDonationForm({ ...donationForm, category: event.target.value })}>
              <option>Cooked Food</option>
              <option>Rice</option>
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Bakery</option>
              <option>Packaged Food</option>
              <option>Other</option>
            </select>
            <input className="input" type="number" min="1" placeholder="Quantity" value={donationForm.quantity} onChange={(event) => setDonationForm({ ...donationForm, quantity: event.target.value })} />
            <input className="input" type="number" min="1" placeholder="Servings" value={donationForm.servings} onChange={(event) => setDonationForm({ ...donationForm, servings: event.target.value })} />
            <input className="input" type="datetime-local" value={donationForm.preparationTime} onChange={(event) => setDonationForm({ ...donationForm, preparationTime: event.target.value })} />
            <input className="input" type="datetime-local" value={donationForm.expiryTime} onChange={(event) => setDonationForm({ ...donationForm, expiryTime: event.target.value })} />
            <input className="input sm:col-span-2" placeholder="Pickup address" value={donationForm.pickupAddress} onChange={(event) => setDonationForm({ ...donationForm, pickupAddress: event.target.value })} />
            <input className="input" placeholder="City" value={donationForm.city} onChange={(event) => setDonationForm({ ...donationForm, city: event.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" type="number" step="0.0001" placeholder="Latitude" value={donationForm.latitude} onChange={(event) => setDonationForm({ ...donationForm, latitude: event.target.value })} />
              <input className="input" type="number" step="0.0001" placeholder="Longitude" value={donationForm.longitude} onChange={(event) => setDonationForm({ ...donationForm, longitude: event.target.value })} />
            </div>
            <textarea className="input sm:col-span-2" rows="3" placeholder="Description" value={donationForm.description} onChange={(event) => setDonationForm({ ...donationForm, description: event.target.value })} />
            <button className="btn-primary sm:col-span-2" type="submit"><Plus className="h-4 w-4" /> Save donation</button>
          </form>
        </section>

        <section className="card p-6">
          <SectionTitle eyebrow="Request" title="Add food request" description="Create a public request for people or organizations in need." />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitRequest}>
            <input className="input" placeholder="Requester name" value={requestForm.requesterName} onChange={(event) => setRequestForm({ ...requestForm, requesterName: event.target.value })} />
            <input className="input" placeholder="Organization name" value={requestForm.organizationName} onChange={(event) => setRequestForm({ ...requestForm, organizationName: event.target.value })} />
            <input className="input" placeholder="Phone" value={requestForm.phone} onChange={(event) => setRequestForm({ ...requestForm, phone: event.target.value })} />
            <input className="input" placeholder="Food required" value={requestForm.foodRequired} onChange={(event) => setRequestForm({ ...requestForm, foodRequired: event.target.value })} />
            <input className="input" type="number" min="1" placeholder="Quantity required" value={requestForm.quantityRequired} onChange={(event) => setRequestForm({ ...requestForm, quantityRequired: event.target.value })} />
            <input className="input" type="number" min="1" placeholder="Servings required" value={requestForm.servingsRequired} onChange={(event) => setRequestForm({ ...requestForm, servingsRequired: event.target.value })} />
            <input className="input sm:col-span-2" placeholder="Address" value={requestForm.address} onChange={(event) => setRequestForm({ ...requestForm, address: event.target.value })} />
            <input className="input" placeholder="City" value={requestForm.city} onChange={(event) => setRequestForm({ ...requestForm, city: event.target.value })} />
            <select className="input" value={requestForm.urgency} onChange={(event) => setRequestForm({ ...requestForm, urgency: event.target.value })}>
              <option>Normal</option>
              <option>Urgent</option>
              <option>Emergency</option>
            </select>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2">
              <input className="input" type="number" step="0.0001" placeholder="Latitude" value={requestForm.latitude} onChange={(event) => setRequestForm({ ...requestForm, latitude: event.target.value })} />
              <input className="input" type="number" step="0.0001" placeholder="Longitude" value={requestForm.longitude} onChange={(event) => setRequestForm({ ...requestForm, longitude: event.target.value })} />
            </div>
            <textarea className="input sm:col-span-2" rows="3" placeholder="Description" value={requestForm.description} onChange={(event) => setRequestForm({ ...requestForm, description: event.target.value })} />
            <button className="btn-primary sm:col-span-2" type="submit"><Plus className="h-4 w-4" /> Save request</button>
          </form>
        </section>
      </div>

      <section className="card p-6">
        <SectionTitle eyebrow="Matches" title="Best food matches" description="The backend scores requests against donations and keeps the best results on top." />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {topMatches.length ? topMatches.map((item, index) => (
            <div key={`${item.donation._id}-${item.request._id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-500">Match {index + 1}</div>
                <StatusBadge status={item.donation.status} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{item.donation.foodName}</h3>
              <p className="mt-1 text-sm text-slate-600">Request: {item.request.organizationName}</p>
              <p className="mt-3 text-sm text-brand-700">Score: {Math.round(item.matchScore || 0)}</p>
              <p className="mt-2 text-sm text-slate-500">{item.explanation || 'Auto-matched by distance, freshness, urgency, and quantity.'}</p>
            </div>
          )) : <p className="text-slate-500">Generate matches to see suggestions here.</p>}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="card p-6">
          <SectionTitle eyebrow="Volunteer" title="Assign a delivery" description="Connect a donation and request to a volunteer in one step." />
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={assignDelivery}>
            <select className="input sm:col-span-2" value={deliveryForm.donationId} onChange={(event) => setDeliveryForm({ ...deliveryForm, donationId: event.target.value })}>
              <option value="">Select donation</option>
              {donations.map((donation) => <option key={donation._id} value={donation._id}>{donation.foodName} - {donation.city}</option>)}
            </select>
            <select className="input sm:col-span-2" value={deliveryForm.requestId} onChange={(event) => setDeliveryForm({ ...deliveryForm, requestId: event.target.value })}>
              <option value="">Select request</option>
              {requests.map((request) => <option key={request._id} value={request._id}>{request.organizationName} - {request.city}</option>)}
            </select>
            <input className="input" placeholder="Volunteer name" value={deliveryForm.volunteerName} onChange={(event) => setDeliveryForm({ ...deliveryForm, volunteerName: event.target.value })} />
            <input className="input" placeholder="Volunteer phone" value={deliveryForm.volunteerPhone} onChange={(event) => setDeliveryForm({ ...deliveryForm, volunteerPhone: event.target.value })} />
            <button className="btn-primary sm:col-span-2" type="submit"><Truck className="h-4 w-4" /> Assign delivery</button>
          </form>
        </section>

        <section className="card p-6">
          <SectionTitle eyebrow="Analytics" title="Live project summary" description="Useful for viva, demo day, and screenshot-based reporting." />
          <div className="grid gap-3 sm:grid-cols-2">
            {deliveries.slice(0, 4).map((delivery) => (
              <div key={delivery._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{delivery.volunteerName}</div>
                  <StatusBadge status={delivery.status} />
                </div>
                <div className="mt-2 text-sm text-slate-500">Pickup: {delivery.pickupLocation}</div>
                <div className="mt-1 text-sm text-slate-500">Drop: {delivery.deliveryLocation}</div>
                <div className="mt-1 text-sm text-slate-500">Distance: {delivery.distance} km</div>
              </div>
            ))}
            {!deliveries.length ? <p className="text-slate-500">No deliveries yet.</p> : null}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-6">
          <SectionTitle eyebrow="Recent donations" title="Latest public donations" description="Visible data from the backend donation collection." />
          <div className="space-y-3">
            {donations.slice(0, 5).map((donation) => (
              <div key={donation._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{donation.foodName}</div>
                    <div className="text-sm text-slate-500">{donation.donorName} · {donation.city}</div>
                  </div>
                  <StatusBadge status={donation.status} />
                </div>
                <div className="mt-2 text-sm text-slate-500">{donation.quantity} units · {donation.servings} servings</div>
              </div>
            ))}
            {!donations.length ? <p className="text-slate-500">No donations yet.</p> : null}
          </div>
        </section>

        <section className="card p-6">
          <SectionTitle eyebrow="Requests" title="Latest public requests" description="Visible data from the backend request collection." />
          <div className="space-y-3">
            {requests.slice(0, 5).map((request) => (
              <div key={request._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{request.organizationName}</div>
                    <div className="text-sm text-slate-500">{request.requesterName} · {request.city}</div>
                  </div>
                  <StatusBadge status={request.urgency.toUpperCase()} />
                </div>
                <div className="mt-2 text-sm text-slate-500">{request.foodRequired} · {request.servingsRequired} servings</div>
              </div>
            ))}
            {!requests.length ? <p className="text-slate-500">No requests yet.</p> : null}
          </div>
        </section>
      </div>

      <section className="card p-6">
        <SectionTitle eyebrow="Project summary" title="Keep it simple" description="The project now runs without login, registration, or user accounts." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: UtensilsCrossed, title: 'Donation', text: 'Public food entry' },
            { icon: Users, title: 'Matching', text: 'Simple AI fallback' },
            { icon: Truck, title: 'Delivery', text: 'Volunteer assignment' },
            { icon: Clock3, title: 'Tracking', text: 'Live status updates' }
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Icon className="h-8 w-8 text-brand-600" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.text}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
