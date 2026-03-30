import { neon } from '@neondatabase/serverless';

// Initialize the Neon SQL client using the URL from environment variables
const sql = neon(import.meta.env.VITE_DATABASE_URL);

/**
 * DB Service: Centralized point for all real SQL queries to the Neon cloud.
 * This replaces the local mock logic with live data.
 */
export const db = {
  // ─── AUTH ──────────────────────────────────────────────────────────────────
  
  async getUserByEmail(email) {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    return result[0];
  },

  async registerUser(name, email, password) {
    const result = await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${name}, ${email}, ${password})
      RETURNING id, name, email
    `;
    return result[0];
  },

  // ─── TOURS ──────────────────────────────────────────────────────────────────

  async getAllTours() {
    return await sql`SELECT * FROM tour_packages ORDER BY id DESC`;
  },

  // ─── BOOKINGS ───────────────────────────────────────────────────────────────

  async createBooking(bookingData) {
    const { user_id, flight_id, tour_id, persons, total_price, date } = bookingData;
    const result = await sql`
      INSERT INTO booking (user_id, flight_id, tour_id, persons, total_price, date, created_at)
      VALUES (${user_id}, ${flight_id}, ${tour_id}, ${persons}, ${total_price}, ${date}, NOW())
      RETURNING *
    `;
    return result[0];
  },

  async getBookingsByUser(user_id) {
    return await sql`SELECT * FROM booking WHERE user_id = ${user_id} ORDER BY created_at DESC`;
  },

  // ─── FLIGHTS (Dynamic Check/Create) ────────────────────────────────────────

  async getAllFlights() {
    try {
      return await sql`SELECT * FROM flights ORDER BY departure ASC`;
    } catch (err) {
      console.warn("Flights table might not exist in Neon yet. Error:", err.message);
      return []; // Result back to mock if table is missing
    }
  }
};

export default sql;
