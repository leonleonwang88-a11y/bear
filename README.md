# Stock Dashboard

A real-time stock tracking dashboard with live price updates, percentage change tracking, and historical charts.

## Features

✅ Real-time stock price updates  
✅ Percentage change display (color-coded)  
✅ Historical price charts  
✅ Add/remove stocks from watchlist  
✅ Local storage persistence  
✅ Yahoo Finance integration  
✅ Responsive design  

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **API**: Yahoo Finance
- **Real-time**: Polling with configurable intervals

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/leonleonwang88-a11y/bear.git
cd bear
```

2. Install server dependencies
```bash
npm install
```

3. Install client dependencies
```bash
cd client
npm install
cd ..
```

4. Create `.env` file
```bash
cp .env.example .env
```

### Running the Application

**Development mode** (runs both server and client):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

## API Endpoints

### Get Stock Quote
```
GET /api/stock/:ticker
```
Returns current price, change, and stock information.

### Get Historical Data
```
GET /api/stock/:ticker/history?period=1mo
```
Parameters:
- `period`: 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max

Returns array of historical prices for charting.

### Validate Ticker
```
GET /api/validate/:ticker
```
Validates if a ticker symbol exists.

## Usage

1. Start the application
2. Enter a stock ticker (e.g., AAPL, GOOGL, MSFT)
3. Click "Add Stock" to add it to your watchlist
4. View real-time prices, changes, and charts
5. Remove stocks with the delete button

## License

MIT
