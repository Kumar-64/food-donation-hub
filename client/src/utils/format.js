export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

export function formatCurrencyOrCount(value) {
  return new Intl.NumberFormat().format(value || 0)
}

export function roleLabel(role) {
  return {
    ADMIN: 'Admin',
    DONOR: 'Donor',
    VOLUNTEER: 'Volunteer',
    NGO: 'NGO',
    ORPHANAGE: 'Orphanage'
  }[role] || role
}
