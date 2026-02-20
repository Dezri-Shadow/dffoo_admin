import Nav from "./Nav";
import { useState, useEffect } from 'react';
import "../css/Settings.css";
import { startSocket, subscribe, request } from '../services/socket';

export default function Settings() {

    const [region, setRegion] = useState('JP'); // Default state

    useEffect(() => {
        // Initialize connection
        startSocket();

        // Subscribe to region updates 
        // Replace 'getEnvValues' with the actual message type your server broadcasts
        const unsubscribe = subscribe('getEnvValues', (data) => {
            if (data.payload && data.payload.REGION) {
                setRegion(data.payload.REGION);
            }
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    const handleToggle = async (e) => {
        const newRegion = e.target.value;
    
        // Use the request helper to tell the server to swap
        const response = await request('setEnvValue', { 
            key: 'REGION', 
            value: newRegion 
        });

        if (response.type === 'error') {
            console.error("Failed to update region:", response.payload.message);
        }
    };

    return (
        <div>
            <Nav/>

            <form>
                <h3>Server Region</h3>

                <label for="JP">
                    <input type="radio" 
                        name="JP/GL" 
                        value="JP" 
                        id="JP" 
                        checked={region === 'JP'} 
                        onChange={handleToggle} />
                    JP (Japan)
                </label>
               <br/>
               <label for="GL">
                    <input type="radio" 
                        name="JP/GL" 
                        value="GL" 
                        id="GL"
                        checked={region === 'GL'} 
                        onChange={handleToggle} />
                    GL (Global)
                </label>
            </form>
        </div>
    );
};