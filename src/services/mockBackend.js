// This file dynamically mocks the Spring Boot Backend locally via Fetch interception.

const originalFetch = window.fetch;

// ─── Mock User Database (persisted in sessionStorage) ──────────────────────
const getUsers = () => JSON.parse(sessionStorage.getItem('mockUsers') || '[]');
const saveUsers = (users) => sessionStorage.setItem('mockUsers', JSON.stringify(users));

// Seed a demo user on first load
if (getUsers().length === 0) {
  saveUsers([
    { id: 1, name: 'Demo User', email: 'demo@travelx.com', password: 'demo1234', role: 'USER' },
    { id: 2, name: 'Admin',     email: 'admin@travelx.com', password: 'admin1234', role: 'ADMIN' },
  ]);
}

// ─── Mock Bookings ────────────────────────────────────────────────────────────
let databaseBookings = [
  {
    id: 'BKG98231',
    name: 'Demo User',
    email: 'demo@travelx.com',
    date: '2026-04-15',
    persons: 2,
    flight: { airline: 'Vistara', from: 'DEL', to: 'BOM', price: 6500, departure: '18:00', arrival: '20:10' },
    bookingDate: new Date().toISOString()
  }
];

// ─── Mock Helper ─────────────────────────────────────────────────────────────
const mockResponse = (data, status = 200) => new Response(
  JSON.stringify(data),
  { status, headers: { 'Content-Type': 'application/json' } }
);

// ─── Intercept Fetch ──────────────────────────────────────────────────────────
window.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url;
  const method = (init?.method || 'GET').toUpperCase();
  let body = {};
  try { body = JSON.parse(init?.body || '{}'); } catch (_) {}

  // ── AUTH: Register ──────────────────────────────────────────────────────────
  if (url.includes('/auth/register') && method === 'POST') {
    const users = getUsers();
    if (users.find(u => u.email === body.email)) {
      return mockResponse({ message: 'Email already registered. Please login.' }, 409);
    }
    const newUser = { id: Date.now(), name: body.name, email: body.email, password: body.password, role: 'USER' };
    users.push(newUser);
    saveUsers(users);
    return mockResponse({ message: 'Registration successful!' }, 201);
  }

  // ── AUTH: Login ─────────────────────────────────────────────────────────────
  if (url.includes('/auth/login') && method === 'POST') {
    const users = getUsers();
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) {
      return mockResponse({ message: 'Invalid email or password.' }, 401);
    }
    const fakeToken = btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }));
    return mockResponse({
      token: fakeToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, 200);
  }

  // ── BOOKINGS: Get user bookings ─────────────────────────────────────────────
  if (url.includes('/bookings') && !url.includes('/admin') && method === 'GET') {
    return mockResponse(databaseBookings);
  }

  // ── BOOKINGS: Create ────────────────────────────────────────────────────────
  if (url.includes('/bookings') && method === 'POST') {
    const newBooking = { ...body, id: `BKG${Math.floor(Math.random()*90000+10000)}`, bookingDate: new Date().toISOString() };
    databaseBookings.push(newBooking);
    return mockResponse(newBooking, 201);
  }

  // ── BOOKINGS: Admin all ─────────────────────────────────────────────────────
  if (url.includes('/bookings/admin/all') && method === 'GET') {
    return mockResponse(databaseBookings);
  }

  // Pass through all other requests (Vite HMR, etc.)
  return originalFetch(input, init);
};
