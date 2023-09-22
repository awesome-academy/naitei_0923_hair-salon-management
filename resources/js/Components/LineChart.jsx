
import { Line } from '@ant-design/charts';
import React from 'react';

const LineChart = (props) => {

    const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];

    const config = {
        data,
        width: 700,
        height: 350,
        autoFit: false,
        xField: 'year',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    };

    let chart;

    return (
        <div className="px-2.5 py-2.5 overflow-x-scroll">
            <div className="flex gap-4">
                <p className="mb-7 text-xl font-semibold">Customer</p>
                
            </div>
            <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>
    );
}

export default LineChart;
