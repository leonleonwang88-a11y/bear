const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const yahooFinance = require('yahoo-finance2').default;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Store for real-time prices
const priceCache = new Map();

// Get current price and basic info
app.get('/api/stock/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const quote = await yahooFinance.quote(ticker);
    
    res.json({
      ticker: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      currency: quote.currency,
      name: quote.longName,
      previousClose: quote.regularMarketPreviousClose,
      open: quote.regularMarketOpen,
      high: quote.fiftyTwoWeekHigh,
      low: quote.fiftyTwoWeekLow,
      marketCap: quote.marketCap
    });
  } catch (error) {
    res.status(400).json({ error: `Failed to fetch stock data: ${error.message}` });
  }
});

// Get historical data for chart
app.get('/api/stock/:ticker/history', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const period = req.query.period || '1mo'; // 1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max
    
    const result = await yahooFinance.chart(ticker, { period, interval: '1d' });
    
    if (!result.quotes || result.quotes.length === 0) {
      throw new Error('No data found');
    }
    
    const historyData = result.quotes.map(quote => ({
      date: new Date(quote.date * 1000).toLocaleDateString(),
      close: quote.close,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      volume: quote.volume
    }));
    
    res.json(historyData);
  } catch (error) {
    res.status(400).json({ error: `Failed to fetch history: ${error.message}` });
  }
});

// Validate ticker
app.get('/api/validate/:ticker', async (req, res) => {
  try {
    const ticker = req.params.ticker.toUpperCase();
    const quote = await yahooFinance.quote(ticker);
    res.json({ valid: true, name: quote.longName });
  } catch (error) {
    res.status(400).json({ valid: false, error: 'Invalid ticker symbol' });
  }
});

app.listen(PORT, () => {
  console.log(`Stock Dashboard API running on http://localhost:${PORT}`);
});
