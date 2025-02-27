import React, { useEffect, useState } from "react";
import CurrencyTable from "./components/CurrencyTable";
import CurrencyConverter from "./components/CurrencyConverter";
import CurrencyChart from "./components/CurrencyChart";
import "./App.css";

function App() {
  const [base, setBase] = useState("EUR");
  const [mainRates, setMainRates] = useState({});
  document.title = "Kalkulator";

  useEffect(() => {
    fetch(`https://api.frankfurter.app/latest?from=${base}`)
      .then((res) => res.json())
      .then((data) => {
        const { rates } = data;
        const filteredRates = {
          USD: rates.USD,
          GBP: rates.GBP,
          CHF: rates.CHF,
          PLN: rates.PLN,
          CAD: rates.CAD,
          JPY: rates.JPY,
        };
        setMainRates(filteredRates);
      });
  }, [base]);

  return (
    <div>
      <h1>Kalkulator walutowy</h1>
      <div className="app-container">
        <div className="left-side">
          <CurrencyTable base={base} mainRates={mainRates} />
        </div>

        <div className="right-side">
          <CurrencyConverter base={base} />
        </div>
      </div>
      <CurrencyChart base={base} />
    </div>
  );
}

export default App;
