"use client";

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "../../../styles/page.module.css";
import { IoLocationSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function Mapz() {
    const mapRef = useRef(null);
    const layerControlRef = useRef(null);
    const [locationInput, setLocationInput] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [marker, setMarker] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(3); // Initial zoom level
    const [layerControlVisible, setLayerControlVisible] = useState(false);
    const [layerOptions, setLayerOptions] = useState([]);

    useEffect(() => {
        const initializeMap = async () => {
            if (!mapRef.current) {
                mapRef.current = L.map('mapz', {
                    doubleClickZoom: false,
                    dragging: true,
                    inertia: true,
                    collapsed: true,
                }).setView([0, 0], zoomLevel); // Set initial zoom level

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(mapRef.current);
            }
        };

        initializeMap();
    }, [zoomLevel]);

    useEffect(() => {
        if (marker) {
            for(let i=0;i<marker.length;i++) {
                mapRef.current.removeLayer(marker[i]);
            }
        }
    }, [marker]);

    useEffect(() => {
        if (coordinates && mapRef.current) {
            const { latitude, longitude } = coordinates;
            mapRef.current.setView([latitude, longitude], 15);
            const newMarker = mapRef.current.addLayer(L.marker([latitude, longitude]));
            setMarker([newMarker]);
        }
    }, [coordinates]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setZoom(zoomLevel);
        }
    }, [zoomLevel]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (layerControlRef.current && !layerControlRef.current.contains(event.target)) {
                setLayerControlVisible(false);
            }
        };

        document.body.addEventListener('click', handleClickOutside);

        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        const location = locationInput.trim();

        // Check if the input is latitude and longitude
        const latLngPattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
        if (latLngPattern.test(location)) {
            const [latitude, longitude] = location.split(',');
            setCoordinates({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
        } else {
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

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                error => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    };

    const handleZoomChange = (value) => {
        setZoomLevel(parseInt(value));
    };

    const toggleLayerControl = () => {
        setLayerControlVisible(!layerControlVisible);
        if (!layerControlVisible) {
            // Populate layer options when opening layer control
            setLayerOptions([
                { name: 'Street Map', layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') },
                { name: 'Satellite Map', layer: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }) },
                { name: 'Terrain Map', layer: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', { attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.', subdomains: ['a', 'b', 'c', 'd'], minZoom: 0, maxZoom: 18 }) },
                { name: 'Watercolor Map', layer: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', { attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.', subdomains: ['a', 'b', 'c', 'd'], minZoom: 1, maxZoom: 16 }) },
                { name: 'CartoDB Dark Map', layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.', subdomains: ['a', 'b', 'c', 'd'], maxZoom: 19 }) }
                // Add more layer options as needed
            ]);
        }
    };
          

    const handleLayerOptionClick = (layer) => {
        // Remove all previously added base layers from the map
        mapRef.current.eachLayer((layer) => {
            if (layer.options && layer.options.isBaseLayer) {
                mapRef.current.removeLayer(layer);
            }
        });

        // Add selected layer to the map
        layer.addTo(mapRef.current);
    };

    return (
        <div className={styles.mapzmaindiv}>
            <div className={styles.controlsContainer}>
                <form onSubmit={handleLocationSubmit} className={styles.formOverlay}>
                    <input 
                        type="text" 
                        placeholder="Enter location name or latitude, longitude" 
                        value={locationInput} 
                        className={styles.mapzinput}
                        onChange={(e) => setLocationInput(e.target.value)} 
                    />
                    <button type="submit" className={styles.mapzsubbutton}><FaSearch /></button>
                </form>
                <div className={styles.geolocationButtonContainer}>
                    <button onClick={handleGeolocation} className={styles.geolocationButton}><IoLocationSharp /></button>
                </div>
                <div className={styles.layerControlContainer}>
                    <button onClick={toggleLayerControl} className={styles.layerControlButton}>
                        Layers
                    </button>
                    <div ref={layerControlRef} id="layerControl" className={`${styles.layerControl} ${layerControlVisible ? styles.visible : ''}`}>
                        {layerOptions.map((option, index) => (
                            <div key={index} className={styles.layerOption} onClick={() => handleLayerOptionClick(option.layer)}>
                                {option.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.mapControls}>
                <input 
                    type="range"
                    min="1"
                    max="18"
                    value={zoomLevel}
                    step="1"
                    onChange={(e) => handleZoomChange(e.target.value)}
                    className={styles.zoomSlider}
                />
            </div>
            
            <div id="mapz" className={styles.mapz}></div>
        </div>
    );
}

