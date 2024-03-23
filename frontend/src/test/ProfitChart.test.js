import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfitChart from '../views/mylist/ProfitChart'; 
import dayjs from 'dayjs';

jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }) => (
    <canvas data-testid="line-chart" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)} />
  )
}));

describe('ProfitChart', () => {
  it('renders correctly and generates profit data', () => {
    const bookings = [
      {
        status: "accepted",
        dateRange: {
          start: "01/10/2023",
          end: "20/10/2023"
        },
        totalPrice: 2318,
      },
      {
        status: 'accepted',
        dateRange: {
          start: dayjs().subtract(1, 'days').format('DD/MM/YYYY'),
          end: dayjs().add(1, 'days').format('DD/MM/YYYY')
        },
        totalPrice: '100'
      },
    ];

    //Calculate expected profits
    let expectedProfits = [];
    let profit = 0;
    for (let i = 30; i >= 0; i--) {
      const date = dayjs().subtract(i, 'days').format('DD/MM/YYYY');
      const index = bookings.findIndex(booking => booking.status === 'accepted' && booking.dateRange.start === date);
      if (index !== -1) {
        profit += Number(bookings[index].totalPrice);
      }
      expectedProfits.push(profit);
    }

    const { getByTestId } = render(<ProfitChart bookings={bookings} />);
    const chart = getByTestId('line-chart');
    const chartData = JSON.parse(chart.getAttribute('data-data'));
    const chartOptions = JSON.parse(chart.getAttribute('data-options'));

    expect(chartData).toBeDefined();
    expect(chartData.labels).toHaveLength(31);
    expect(chartData.datasets).toHaveLength(1); 
    expectedProfits.forEach(profitAmount => {
      expect(chartData.datasets[0].data).toContain(profitAmount);
    });
    expect(chartOptions).toBeDefined();
    expect(chartOptions.scales.y.beginAtZero).toBeTruthy();
  });
});