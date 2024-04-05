import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellerInsight = () => {
    const [sustainabilityPlot, setSustainabilityPlot] = useState(null);
    const [logisticsPlot, setLogisticsPlot] = useState(null);
    const [optimizedRoutePlot, setOptimizedRoutePlot] = useState(null);

    useEffect(() => {
        // Fetch sustainability pie chart
        axios.get('http://localhost:5000/api/sustainability_pie_chart', { responseType: 'arraybuffer' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setSustainabilityPlot(imageUrl);
            })
            .catch(error => console.error('Error fetching sustainability pie chart:', error));

        // Fetch logistics histogram
        axios.get('http://localhost:5000/api/logistics_histogram', { responseType: 'arraybuffer' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setLogisticsPlot(imageUrl);
            })
            .catch(error => console.error('Error fetching logistics histogram:', error));

        // Fetch optimized transportation route plot
        axios.get('http://localhost:5000/api/optimized_transportation_route', { responseType: 'arraybuffer' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setOptimizedRoutePlot(imageUrl);
            })
            .catch(error => console.error('Error fetching optimized transportation route plot:', error));
    }, []);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {/* Sidebar */}
                <div style={{ width: '20%', backgroundColor: '#007bff', padding: '20px', color: '#fff' }}>
                    <h2>Recommendations</h2>
                    <Link to="/seller-optimized-insights" style={{ textDecoration: 'none', color: '#fff' }}>
                        <button style={{ backgroundColor: '#fff', color: '#007bff', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
                            A.I. Route Optimizer
                        </button>
                    </Link>
                </div>

                {/* Main Content */}
                <div style={{ width: '80%', padding: '20px', backgroundColor: '#007bff', color: '#fff' }}>
                    <h1>Seller Insight</h1>

                    {/* Individual Plots */}
                    {/* {sustainabilityPlot &&
                        <div>
                            <h2>Sustainability Pie Chart</h2>
                            <img src={sustainabilityPlot} alt="Sustainability Pie Chart" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    } */}

                    {logisticsPlot &&
                        <div>
                            <h2>Logistics Histogram</h2>
                            <img src={logisticsPlot} alt="Logistics Histogram" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    }

                    {/* {optimizedRoutePlot &&
                        <div>
                            <h2>Optimized Transportation Route</h2>
                            <img src={optimizedRoutePlot} alt="Optimized Transportation Route" style={{ maxWidth: '100%', height: 'auto' }} />
                        </div>
                    } */}
                </div>
            </div>
        </div>
    );
};

export default SellerInsight;
