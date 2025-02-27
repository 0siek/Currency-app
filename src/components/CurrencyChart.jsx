import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "../App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ALL_CURRENCIES = ["EUR", "USD", "GBP", "CHF", "PLN", "CAD", "JPY"];

const PREDEFINED_RANGES = [
  { label: "7 dni", value: 7 },
  { label: "30 dni", value: 30 },
  { label: "3 miesiące", value: 90 },
  { label: "6 miesięcy", value: 180 },
  { label: "1 rok", value: 365 },
  { label: "2 lata", value: 730 },
  { label: "3 lata", value: 1095 },
  { label: "Własny przedział", value: "custom" },
];

function CurrencyChart({ base }) {
  const [chartCurrency, setChartCurrency] = useState("USD");
  const [chartData, setChartData] = useState(null);

  // Stan do zarządzania zakresem
  const [selectedRange, setSelectedRange] = useState(7);
  const [customRangeDays, setCustomRangeDays] = useState(30);
  const [customRangeType, setCustomRangeType] = useState("days");

  const formatDate = (date) => date.toISOString().split("T")[0];

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    let daysBack;
    if (selectedRange === "custom") {
      if (customRangeType === "days") {
        daysBack = customRangeDays;
      } else {
        daysBack = customRangeDays * 365;
      }
    } else {
      daysBack = selectedRange;
    }

    startDate.setDate(endDate.getDate() - daysBack);
    return { start: formatDate(startDate), end: formatDate(endDate) };
  };

  useEffect(() => {
    const { start, end } = getDateRange();

    fetch(
      `https://api.frankfurter.app/${start}..${end}?from=PLN&to=${chartCurrency}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.rates) return;

        // Wszystkie dostępne daty
        const allDates = Object.keys(data.rates).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        let filteredDates = [];
        if (selectedRange === "custom") {
          const diffDays = (date1, date2) =>
            (new Date(date2) - new Date(date1)) / (1000 * 60 * 60 * 24);
          if (customRangeType === "years") {
            filteredDates = allDates.filter((date, index) => {
              const currentYear = new Date(date).getFullYear();
              const prevYear =
                index > 0 ? new Date(allDates[index - 1]).getFullYear() : null;
              return currentYear !== prevYear;
            });
          } else if (customRangeType === "days" && customRangeDays > 365) {
            filteredDates = allDates.filter((date, index) => {
              const current = new Date(date);
              const prev = index > 0 ? new Date(allDates[index - 1]) : null;
              return prev && current.getMonth() !== prev.getMonth();
            });
          } else {
            filteredDates = allDates;
          }
        } else if (selectedRange > 3650) {
          filteredDates = allDates.filter(
            (date) => new Date(date).getMonth() === 0
          );
        } else if (selectedRange > 365) {
          filteredDates = allDates.filter((date, index) => {
            const current = new Date(date);
            const prev = index > 0 ? new Date(allDates[index - 1]) : null;
            return prev && current.getMonth() !== prev.getMonth();
          });
        } else {
          filteredDates = allDates;
        }

        const values = filteredDates.map(
          (date) => data.rates[date][chartCurrency]
        );

        setChartData({
          labels: filteredDates,
          datasets: [
            {
              label: `Kurs PLN/${chartCurrency}`,
              data: values,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              pointBackgroundColor: "rgba(255,99,132,1)",
              pointBorderColor: "rgba(54,162,235,1)",
              pointRadius: 4,
            },
          ],
        });
      });
  }, [base, chartCurrency, selectedRange, customRangeDays, customRangeType]);

  return (
    <div className="container">
      <h2>Wykres kursów z wybranego przedziału czasowego</h2>

      <div>
        <label>
          Wybierz walutę:
          <select
            value={chartCurrency}
            onChange={(e) => setChartCurrency(e.target.value)}
          >
            {ALL_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Wybierz zakres:
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {PREDEFINED_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </label>

        {selectedRange === "custom" && (
          <div>
            <label>
              Podaj wartość:
              <input
                type="number"
                min="1"
                value={customRangeDays}
                onChange={(e) => setCustomRangeDays(Number(e.target.value))}
              />
            </label>
            <label>
              Jednostka:
              <select
                value={customRangeType}
                onChange={(e) => setCustomRangeType(e.target.value)}
              >
                <option value="days">dni</option>
                <option value="years">lata</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {!chartData ? <p>Ładowanie wykresu...</p> : <Line data={chartData} />}
    </div>
  );
}

export default CurrencyChart;
