import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import "./App.css"

const CurrencyExchangeApp = () => {
  const [activeCurrency, setActiveCurrency] = useState('USDZAR');
  const [exchangeData, setExchangeData] = useState([]);

  useEffect(() => {
    fetchExchangeData(activeCurrency);
  }, [activeCurrency]);

  const fetchExchangeData = (currency) => {
    fetch('https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_CdiqhZ2CxxjCMJl8utS2CaN9iHk7dee10JtiWxNg&date=2024-04-09&base_currency=USD&currencies=ZAR,EUR')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched data:', data);
      const exchangeRates = data.data;
      const currencyData = currency === 'USDZAR' ? exchangeRates.ZAR : exchangeRates.EUR;
      const historical = {
        '2024-04-09': currencyData.value  
        
      };
      const filteredData = Object.entries(historical);
      setExchangeData(filteredData);
    })
    .catch(error => console.error('Error fetching exchange data:', error));
  }

  const toggleCurrency = (currency) => {
    if (currency !== activeCurrency) {
      setActiveCurrency(currency);
    }
  }

  useEffect(() => {
    const ctx = document.getElementById('exchangeChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: exchangeData.map(([date]) => date),
        datasets: [{
          label: activeCurrency,
          data: exchangeData.map(([, rate]) => rate),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Exchange Rate'
            }
          }]
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [exchangeData]);

  return (
    <div className="currencyPair">
        <h1>Historical Currency Rates</h1>
        <div className='button'>
            <button className={activeCurrency === 'USDZAR' ? 'active' : ''} onClick={() => toggleCurrency('USDZAR')}>USD/ZAR</button>
            <button className={activeCurrency === 'USDEUR' ? 'active' : ''} onClick={() => toggleCurrency('USDEUR')}>USD/EUR</button>
        </div>
        <div>
            <canvas id="exchangeChart"></canvas>
        </div>
    </div>
  );
};

export default CurrencyExchangeApp;
