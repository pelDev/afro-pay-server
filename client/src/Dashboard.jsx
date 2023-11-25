import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const [serverData, setServerData] = useState(0);

    const mainStyle = {
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px"
    }

    useEffect(() => {
        const socket = new WebSocket( socketUrl ?? 'ws://localhost:5000/bal' );

        // Connection opened
        socket.addEventListener('open', (event) => {
        console.log('WebSocket connected');
        });

        socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        console.log('Received message from server:', data);
        const balance = data.merchantBalance ?? data.updatedBalance
        setServerData((prevBalance) => prevBalance + balance)
        });

        socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        });

        return () => {
        console.log('Component unmounted, closing WebSocket connection');
        socket.close();
        };
    }, []);

    return (
        <div style={mainStyle}>
            <h1 className='text-2xl'>Merchant's Balance</h1>
            <h2 className='text-3xl'>USD { serverData }</h2>
        </div>
    );
};

export default Dashboard;
