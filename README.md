# Rob's Availability Calendar

A simple, static availability calendar that displays my weekly schedule, pulling data from Airtable. It's intended as a section of my website that is compiled elsewhere, so it has the same styles. If you use this, just replace the branding and styles with your own.

## Features

- **5-week view**: Current week + 4 weeks ahead
- **Carousel navigation**: Browse through weeks with previous/next/current week buttons
- **Smart time block handling**:
  - Automatically splits regular blocks when special events are booked
  - Consolidates adjacent blocks with the same status
  - Color-coded blocks: Available (green), Busy (orange), Special bookings (red/blue)
- **Responsive design**: Works on desktop and mobile

## To do / to come

- Booking functionality (using Netlify or Airtable)

## Tech Stack

- Vanilla JavaScript (ES6)
- SCSS for styling
- Parcel bundler
- Airtable API for data storage
- Netlify for hosting

## Local Development

1. **Install dependencies:**

```bash
   npm install
```

2. **Create `.env` file:**

```
   AIRTABLE_TOKEN=your_token_here
   AIRTABLE_BASE_ID=your_base_id_here
```

3. **Fetch data from Airtable:**

```bash
   npm run update
```

4. **Run development server:**

```bash
   npm run dev
```

5. **Build for production:**

```bash
   npm run build
```

## Airtable Structure

**Table**: Availability Calendar (`tbl1ucQlM87KGxyjI`)

**Fields**:

- `Title` (text) - Internal description
- `Start Time` (text) - HH:MM format
- `End Time` (text) - HH:MM format
- `Day of Week` (text) - For recurring events (e.g., "Monday")
- `Date` (date) - For one-off events (YYYY-MM-DD)
- `Event Type` (select) - "Regular" or "Special"
- `Status` (select) - "Available", "Busy"
- `Notes` (text) - Internal notes

## Deployment

Deployed on Netlify at [calendar.robbutz.com](https://calendar.robbutz.com)

## License

Personal project - © 2024 Rob Butz
