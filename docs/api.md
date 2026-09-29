# API

## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Donations
- `POST /api/donations`
- `GET /api/donations`
- `GET /api/donations/:id`
- `PUT /api/donations/:id`
- `DELETE /api/donations/:id`

## Requests
- `POST /api/requests`
- `GET /api/requests`
- `GET /api/requests/:id`
- `PUT /api/requests/:id`

## Matching
- `GET /api/matches`
- `POST /api/matches/generate`

## Deliveries
- `POST /api/deliveries`
- `GET /api/deliveries`
- `PUT /api/deliveries/:id/status`
- `POST /api/deliveries/:id/verify`

## Notifications
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`
