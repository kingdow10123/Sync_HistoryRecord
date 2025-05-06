import React, { useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css';

// 註冊 Chart.js 元件
ChartJS.register(BarElement, CategoryScale, LinearScale);

function App() {
  const [startDate, setStartDate] = useState('2024-12-30');
  const [endDate, setEndDate] = useState('');
  const [dataType, setDataType] = useState('腿圍');
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const generateData = () => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    if (end < start) {
      alert('結束日期不能早於開始日期！');
      return;
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newLabels = [];
    const newData = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      newLabels.push(dateStr);

      let value;
      if (dataType === '腿圍') {
        value = getRandom(30, 45); // cm
      } else if (dataType === '體重') {
        value = getRandom(50, 80); // kg
      } else if (dataType === '血壓') {
        value = getRandom(110, 140); // mmHg
      } else if (dataType === '心跳') {
        value = getRandom(60, 100); // bpm
      }
      newData.push(value);
    }

    setLabels(newLabels);
    setData(newData);
  };

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const chartData = {
    labels: labels,
    datasets: [{
      label: `${dataType} 測量值`,
      data: data,
      backgroundColor: data.map(val => {
        if (dataType === '血壓' && val > 130) return 'red';
        return '#F08000';
      })
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="container">
      <h1>歷史記錄</h1>

      <div className="date-range">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <span>～</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      <div className="select-group">
        <select value={dataType} onChange={e => setDataType(e.target.value)}>
          <option value="腿圍">腿圍</option>
          <option value="體重">體重</option>
          <option value="血壓">血壓</option>
          <option value="心跳">心跳</option>
        </select>
      </div>

      <h2>今日測量結果</h2>

      <div className="chart-wrapper">
        {labels.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>請選擇日期區間並點擊查詢</p>
        )}
      </div>

      <button onClick={generateData}>查詢</button>
    </div>
  );
}

export default App;
