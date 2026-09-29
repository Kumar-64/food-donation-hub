export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{eyebrow}</p> : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      {description ? <p className="mt-3 max-w-3xl text-slate-600">{description}</p> : null}
    </div>
  )
}

export function StatCard({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      {hint ? <p className="mt-2 text-sm text-slate-500">{hint}</p> : null}
    </div>
  )
}

export function StatusBadge({ status }) {
  const colors = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    MATCHED: 'bg-lime-100 text-lime-700',
    VOLUNTEER_ASSIGNED: 'bg-blue-100 text-blue-700',
    PICKED_UP: 'bg-amber-100 text-amber-700',
    DELIVERED: 'bg-emerald-100 text-emerald-700',
    EXPIRED: 'bg-rose-100 text-rose-700',
    OPEN: 'bg-emerald-100 text-emerald-700',
    FULFILLED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-slate-100 text-slate-700',
    URGENT: 'bg-amber-100 text-amber-700',
    EMERGENCY: 'bg-rose-100 text-rose-700'
  }

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colors[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
}
