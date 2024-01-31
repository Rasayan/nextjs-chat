"use client"

import dynamic from 'next/dynamic';
import styles from "../../../styles/page.module.css";
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

export default function Mapz() {
    const mapRef = useRef(null);

    useEffect(() => {
        const initializeMap = async () => {
            const L = dynamic(() => import('leaflet'), { ssr: false });

            if (!mapRef.current) {
                mapRef.current = L.map('mapzmap').setView([0, 0], 2);

                // Use local marker images
                const markerIcon2x = require('leaflet/dist/images/marker-icon-2x.png');
                const markerIcon = require('leaflet/dist/images/marker-icon.png');
                const markerShadow = require('leaflet/dist/images/marker-shadow.png');

                const customMarkerIcon = L.icon({
                    iconUrl: markerIcon.default,
                    iconRetinaUrl: markerIcon2x.default,
                    shadowUrl: markerShadow.default,
                    iconSize: [25, 41], // Size of the icon
                    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
                    popupAnchor: [1, -34] // Point from which the popup should open relative to the iconAnchor
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);

                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        mapRef.current.setView([latitude, longitude], 12);
                        L.marker([latitude, longitude], { icon: customMarkerIcon }).addTo(mapRef.current);
                    });
                }
            }
        };

        initializeMap();
    }, []);

    return (
        <div className={styles.mapzmaindiv}>
            <div id={styles.mapzmap}></div>
        </div>
    );
}


