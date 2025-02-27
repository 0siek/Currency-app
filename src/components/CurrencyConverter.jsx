import React, { useState, useEffect } from "react";
import "../App.css";
const ALL_CURRENCIES = ["EUR", "USD", "GBP", "CHF", "PLN", "CAD", "JPY"];

function CurrencyConverter({ base }) {
  const [amount, setAmount] = useState(1);
  const [target, setTarget] = useState("USD");
  const [baseCurrent, setCurrent] = useState("EUR");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Jeśli waluty są takie same, ustawiamy błąd i nie fetchujemy
    if (baseCurrent === target) {
      setError("Waluta wejściowa i wyjściowa nie mogą być takie same.");
      setResult(null);
      return;
    } else {
      setError("");
    }

    if (amount > 0 && baseCurrent && target) {
      fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${baseCurrent}&to=${target}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.rates) {
            setResult(data.rates[target]);
          } else {
            setResult(null);
          }
        })
        .catch(() => setResult(null));
    }
  }, [amount, baseCurrent, target]);

  const handleConvert = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <h2>Kalkulator</h2>
      <form onSubmit={handleConvert}>
        <label>
          Kwota:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </label>
        <label>
          Z:
          <select
            value={baseCurrent}
            onChange={(e) => setCurrent(e.target.value)}
          >
            {ALL_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Na:
          <select
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
            }}
          >
            {ALL_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && !error && (
        <div>
          {amount} {baseCurrent} = {result} {target}
        </div>
      )}
    </div>
  );
}

export default CurrencyConverter;
