import logo from './logo.svg'
import './App.css'
import Chart from './Chart'

const chartProps = {
  data: [
    {
      date: '2020-10-22',
      elect: 45,
      water: 76,
      label: 'Oct'
    },
    {
      date: '2020-09-20',
      elect: 24,
      water: 67,
      label: 'Sept'
    },
    {
      date: '2020-08-22',
      elect: 23,
      water: 94,
      label: 'Aug'
    },
    {
      date: '2020-10-22',
      elect: 12,
      water: 48,
      label: 'Sep'
    }
  ],
  x: 'date',
  y: ['elect', 'water'],
  type: 'vertical',
  parentWidth: 600,
  parentHeight: 400,
  interval: 5
}

function App() {
  return (
    <div className='App'>
      <Chart {...chartProps} />
    </div>
  )
}

export default App
