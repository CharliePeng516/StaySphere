import React from 'react';
import dayjs from 'dayjs';
import { Typography, Divider } from 'antd';
import { Line } from 'react-chartjs-2';
import './profitChart.scss';
import PropTypes from 'prop-types';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController, BarController, Tooltip, Legend } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Tooltip,
  Legend
);
const { Title } = Typography;

const ProfitChart = ({bookings}) => {

    const acceptBooking = bookings.filter(item=>item.status === 'accepted')
    const dateRanges = acceptBooking.map((booking) => booking.dateRange);
    const data = {
        labels: [],
        datasets: [
            {
                label: 'Profit Data',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };
    let profit = 0;
    for (let i = 30; i >= 0; i--) {
        const date = dayjs().subtract(i, 'days').format('DD/MM/YYYY');
        data.labels.push(date);
        const index = dateRanges.findIndex(range => range.start === date);
        if (index !== -1){
            profit += Number(acceptBooking[index].totalPrice);
        }
        data.datasets[0].data.push(profit);
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className='chart_container'>
            <Divider> 
            <Title level={3}>{'Profit Chart for last 30 days'}</Title>
            </Divider>
            <Line data={data} options={options} />;
        </div>
    );
};


ProfitChart.propTypes = {
    bookings: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.oneOf(['accepted', 'pending', 'declined']), 
        dateRange: PropTypes.shape({
          start: PropTypes.string,
          end: PropTypes.string
        }),
        totalPrice: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ])
      })
    )
  };
export default ProfitChart;

