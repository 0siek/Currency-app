import React from "react";
import "../App.css";
function CurrencyTable({ base, mainRates }) {
  return (
    <div className="container">
      <h2>Kursy głównych walut bazując na: {base}</h2>
      <table>
        <thead>
          <tr>
            <th>Waluta</th>
            <th>Kurs</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mainRates).map(([currency, rate]) => (
            <tr key={currency}>
              <td>{currency}</td>
              <td>{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrencyTable;
