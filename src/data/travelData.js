// Shared travel data used by Flights page, Chatbot, and other components

export const allFlights = [
  // Domestic - Delhi ↔ Mumbai
  { id: 'IG101', airline: 'IndiGo',    departure: '06:00', arrival: '08:30', duration: 150, price: 4500, from: 'DEL', to: 'BOM' },
  { id: 'AI202', airline: 'Air India', departure: '07:15', arrival: '09:25', duration: 130, price: 5200, from: 'DEL', to: 'BOM' },
  { id: 'SJ303', airline: 'SpiceJet',  departure: '10:00', arrival: '12:45', duration: 165, price: 3900, from: 'DEL', to: 'BOM' },
  { id: 'IG404', airline: 'IndiGo',    departure: '14:30', arrival: '17:00', duration: 150, price: 4800, from: 'DEL', to: 'BOM' },
  { id: 'UK505', airline: 'Vistara',   departure: '18:00', arrival: '20:10', duration: 130, price: 6500, from: 'DEL', to: 'BOM' },
  { id: 'QP606', airline: 'Akasa Air', departure: '22:30', arrival: '01:00', duration: 150, price: 4100, from: 'DEL', to: 'BOM' },
  { id: 'IG111', airline: 'IndiGo',    departure: '08:00', arrival: '10:30', duration: 150, price: 5000, from: 'BOM', to: 'DEL' },
  { id: 'UK222', airline: 'Vistara',   departure: '11:15', arrival: '13:25', duration: 130, price: 5800, from: 'BOM', to: 'DEL' },
  { id: 'AI333', airline: 'Air India', departure: '15:45', arrival: '18:00', duration: 135, price: 5400, from: 'BOM', to: 'DEL' },
  { id: 'QP444', airline: 'Akasa Air', departure: '20:00', arrival: '22:15', duration: 135, price: 5100, from: 'BOM', to: 'DEL' },
  // Domestic - Delhi ↔ Hyderabad
  { id: 'IG555', airline: 'IndiGo',    departure: '09:00', arrival: '11:15', duration: 135, price: 4200, from: 'DEL', to: 'HYD' },
  { id: 'AI556', airline: 'Air India', departure: '13:00', arrival: '15:20', duration: 140, price: 4900, from: 'DEL', to: 'HYD' },
  { id: 'SJ559', airline: 'SpiceJet',  departure: '06:30', arrival: '08:50', duration: 140, price: 3800, from: 'DEL', to: 'HYD' },
  { id: 'IG557', airline: 'IndiGo',    departure: '17:00', arrival: '19:20', duration: 140, price: 4600, from: 'HYD', to: 'DEL' },
  { id: 'UK558', airline: 'Vistara',   departure: '07:00', arrival: '09:25', duration: 145, price: 5300, from: 'HYD', to: 'DEL' },
  // Domestic - Mumbai ↔ Hyderabad
  { id: 'IG601', airline: 'IndiGo',    departure: '06:30', arrival: '08:00', duration: 90,  price: 3200, from: 'BOM', to: 'HYD' },
  { id: 'SJ602', airline: 'SpiceJet',  departure: '14:00', arrival: '15:35', duration: 95,  price: 2900, from: 'BOM', to: 'HYD' },
  { id: 'AI603', airline: 'Air India', departure: '19:00', arrival: '20:40', duration: 100, price: 3800, from: 'HYD', to: 'BOM' },
  // Domestic - Delhi ↔ Bangalore
  { id: 'IG701', airline: 'IndiGo',    departure: '05:30', arrival: '11:00', duration: 210, price: 7500, from: 'DEL', to: 'BLR' },
  { id: 'UK702', airline: 'Vistara',   departure: '10:00', arrival: '15:30', duration: 210, price: 8200, from: 'BLR', to: 'DEL' },
  // Domestic - Delhi ↔ Kolkata
  { id: 'AI801', airline: 'Air India', departure: '08:00', arrival: '10:00', duration: 120, price: 5000, from: 'DEL', to: 'CCU' },
  { id: 'QP802', airline: 'Akasa Air', departure: '16:00', arrival: '18:05', duration: 125, price: 4400, from: 'CCU', to: 'DEL' },
  // Domestic - Mumbai ↔ Bangalore
  { id: 'IG901', airline: 'IndiGo',    departure: '07:30', arrival: '09:10', duration: 100, price: 3500, from: 'BOM', to: 'BLR' },
  { id: 'SJ902', airline: 'SpiceJet',  departure: '19:30', arrival: '21:15', duration: 105, price: 3100, from: 'BLR', to: 'BOM' },
  // International
  { id: 'SQ901', airline: 'Singapore Air', departure: '09:00', arrival: '15:00', duration: 330,  price: 28000, from: 'DEL', to: 'SIN' },
  { id: 'SQ902', airline: 'Singapore Air', departure: '22:00', arrival: '06:00', duration: 330,  price: 26000, from: 'BOM', to: 'SIN' },
  { id: 'EK001', airline: 'Emirates',      departure: '03:00', arrival: '06:00', duration: 240,  price: 35000, from: 'DEL', to: 'DXB' },
  { id: 'EK002', airline: 'Emirates',      departure: '08:00', arrival: '11:30', duration: 210,  price: 32000, from: 'BOM', to: 'DXB' },
  { id: 'QR002', airline: 'Qatar Airways', departure: '22:00', arrival: '01:30', duration: 270,  price: 38000, from: 'DEL', to: 'DOH' },
  { id: 'QF121', airline: 'Qantas',        departure: '04:00', arrival: '20:00', duration: 960,  price: 52000, from: 'SYD', to: 'BOM' },
  { id: 'QF123', airline: 'Qantas',        departure: '06:00', arrival: '22:00', duration: 960,  price: 55000, from: 'SYD', to: 'BOM' },
  { id: 'QF125', airline: 'Qantas',        departure: '10:00', arrival: '02:00', duration: 960,  price: 58000, from: 'SYD', to: 'BOM' },
  { id: 'AI301', airline: 'Air India',     departure: '10:00', arrival: '04:00', duration: 1080, price: 52000, from: 'BOM', to: 'SYD' },
  { id: 'AI303', airline: 'Air India',     departure: '14:00', arrival: '08:00', duration: 1080, price: 54000, from: 'BOM', to: 'SYD' },
  { id: 'BA101', airline: 'British Airways', departure: '08:00', arrival: '21:00', duration: 540,  price: 65000, from: 'LHR', to: 'DEL' },
  { id: 'VS202', airline: 'Virgin Atlantic', departure: '10:30', arrival: '23:45', duration: 560,  price: 62000, from: 'LHR', to: 'DEL' },
  { id: 'BA103', airline: 'British Airways', departure: '18:00', arrival: '07:30', duration: 540,  price: 68000, from: 'LHR', to: 'DEL' },
];

export const allHotels = [
  { id: 1, name: 'The Taj Mahal Palace', location: 'Mumbai', price: 25000, rating: 4.9, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'The Oberoi Amarvilas', location: 'Agra', price: 35000, rating: 5.0, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Marina Bay Sands',  location: 'Singapore', price: 45000, rating: 4.8, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Burj Al Arab',      location: 'Dubai', price: 95000, rating: 5.0, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Le Meurice',        location: 'Paris', price: 55000, rating: 4.7, image: 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

// Airport code to city name mapping
export const airportCodes = {
  'DEL': 'Delhi',
  'BOM': 'Mumbai',
  'HYD': 'Hyderabad',
  'BLR': 'Bangalore',
  'CCU': 'Kolkata',
  'SIN': 'Singapore',
  'DXB': 'Dubai',
  'DOH': 'Doha',
  'SYD': 'Sydney',
};

// City name (lowercase) to airport code mapping
export const cityToCode = {
  'delhi': 'DEL', 'new delhi': 'DEL', 'del': 'DEL',
  'mumbai': 'BOM', 'bombay': 'BOM', 'bom': 'BOM',
  'hyderabad': 'HYD', 'hyd': 'HYD',
  'bangalore': 'BLR', 'bengaluru': 'BLR', 'blr': 'BLR',
  'kolkata': 'CCU', 'calcutta': 'CCU', 'ccu': 'CCU',
  'singapore': 'SIN', 'sin': 'SIN',
  'dubai': 'DXB', 'dxb': 'DXB',
  'doha': 'DOH', 'doh': 'DOH',
  'sydney': 'SYD', 'syd': 'SYD',
};

export const allTours = [
  { id: 1, title: 'Bali Tropical Paradise', location: 'Bali, Indonesia', price: 45000, duration: '6 Days', rating: 4.8, reviews: 124 },
  { id: 2, title: 'Swiss Alps Adventure',   location: 'Zermatt, Switzerland', price: 85000, duration: '7 Days', rating: 4.9, reviews: 89  },
  { id: 3, title: 'Mystical Kyoto Tour',    location: 'Kyoto, Japan', price: 62000, duration: '5 Days', rating: 4.7, reviews: 210 },
  { id: 4, title: 'Paris Romance',          location: 'Paris, France', price: 55000, duration: '4 Days', rating: 4.6, reviews: 156 },
  { id: 5, title: 'Tokyo City Explorer',    location: 'Tokyo, Japan', price: 78000, duration: '6 Days', rating: 4.8, reviews: 98  },
  { id: 6, title: 'Dubai Luxury Escape',    location: 'Dubai, UAE', price: 95000, duration: '5 Days', rating: 4.7, reviews: 175 },
  { id: 7, title: 'Singapore Discovery',    location: 'Singapore', price: 52000, duration: '4 Days', rating: 4.6, reviews: 142 },
];
