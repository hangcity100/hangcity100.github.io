
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNi0wMi0xMyAwNToxMToyNCIsInVzZXJfaWQiOiJtYXR0aGV3NTYiLCJlbWFpbCI6ImhhbmdjaXR5MTAwQGdtYWlsLmNvbSIsImlwIjoiMTAxLjguMjM5LjE1MiJ9.EqzjckT_fEF1pU4rHTni8pv3VBu0Ow_sAXY38fRVJN4";

app.get("/api/stock", async (req, res) => {
  try {
    const stockId = req.query.stock_id || "2330";
    const startDate = req.query.start_date || "2024-01-01";

    const url =
      "https://api.finmindtrade.com/api/v4/data" +
      `?dataset=TaiwanStockPrice` +
      `&data_id=${encodeURIComponent(stockId)}` +
      `&start_date=${encodeURIComponent(startDate)}` +
      `&token=${encodeURIComponent(TOKEN)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running: http://localhost:3000");
});
