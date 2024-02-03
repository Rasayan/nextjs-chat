"use client"

import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "../../../styles/page.module.css";

export default function Mapz() {
    const mapRef = useRef(null);
    const [locationInput, setLocationInput] = useState('');
    const [coordinates, setCoordinates] = useState(null);

    useEffect(() => {
        const initializeMap = async () => {
            if (!mapRef.current) {
                mapRef.current = L.map('mapzmap').setView([0, 0], 3);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);
            }
        };

        initializeMap();
    }, []);

    useEffect(() => {
        if (coordinates && mapRef.current) {
            const { latitude, longitude } = coordinates;
            mapRef.current.setView([latitude, longitude], 15);
            L.marker([latitude, longitude]).addTo(mapRef.current);
        }
    }, [coordinates]);

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        const location = locationInput.trim();

        // Check if the input is latitude and longitude
        const latLngPattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
        if (latLngPattern.test(location)) {
            const [latitude, longitude] = location.split(',');
            setCoordinates({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
        } else {
            // Perform location search using a geocoding service
            // Replace this with your preferred geocoding service
            // For example, you can use OpenStreetMap Nominatim API
            fetch(`https://nominatim.openstreetmap.org/search?q=${location}&format=json`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
                    } else {
                        console.log('Location not found');
                    }
                })
                .catch(error => console.error('Error searching location:', error));
        }
    };

    return (
        <div className={styles.mapzmaindiv}>
            <form onSubmit={handleLocationSubmit}>
                <input 
                    type="text" 
                    placeholder="Enter location name or latitude, longitude" 
                    value={locationInput} 
                    className={styles.mapzinput}
                    onChange={(e) => setLocationInput(e.target.value)} 
                />
                <button type="submit" className={styles.mapzsubbutton}>Go</button>
            </form>
            <div className={styles.mapzdiv}>
                <div id="mapzmap" className={styles.mapz}></div>
            </div>
        </div>
    );
}
