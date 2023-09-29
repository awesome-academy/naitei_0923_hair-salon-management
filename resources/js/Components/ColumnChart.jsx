import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DualAxes } from '@ant-design/plots';

const ColumnChart = (props) => {
    const {data, nameChart, xField, yField} = props;
    
    const config = {
        data: [data, data],
        isGroup: true,
        padding: 'auto',
        height: 400,
        autoFit: false,
        xField: xField,
        yField: yField,
        geometryOptions: [
            {
                geometry: 'column',
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 2,
                },
            },
        ],
    };

    let chart;
    return (
        <div className="px-2.5 py-2.5 overflow-x-scroll">
            <div className="flex gap-4">
                <p className="mb-7 text-xl font-semibold">{nameChart}</p>              
            </div>
            <DualAxes {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>
    );
  
};

export default ColumnChart;
