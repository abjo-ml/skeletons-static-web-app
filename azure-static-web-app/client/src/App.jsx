import React, { useState, useEffect } from 'react';
import TableComponent from './TableComponent';
import './index.css';

const API_URL = 'https://white-pebble-01065ee03.4.azurestaticapps.net/api/bus-data';

function callApi() {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        });
}

function insertApiData(newData) {
    const POST_URL = 'https://white-pebble-01065ee03.4.azurestaticapps.net/api/insert-item'; // Change this URL to the appropriate endpoint
    return fetch(POST_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to insert data');
        }
        return response.json();
    });
}

function App() {
    const [apiData, setApiData] = useState(null);
    const [newData, setNewData] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const data = await callApi();
            setApiData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleUpdate() {
        try {
            await insertApiData(newData); // Use the new function to insert data
            fetchData();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setNewData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    return (
        <div className="article">
            <h2>Hello World!</h2>

            <button onClick={fetchData}>Refresh Table</button>
            {apiData && <TableComponent data={apiData} />}

            <div>
                <input
                    type="text"
                    name="item_name" // Change the name to match the API endpoint
                    placeholder="Item"
                    value={newData.item_name || ''}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="amount" // Change the name to match the API endpoint
                    placeholder="Amount"
                    value={newData.amount || ''}
                    onChange={handleChange}
                />
                <button onClick={handleUpdate}>Insert Data</button> {/* Update button text */}
            </div>
        </div>
    );
}

export default App;
