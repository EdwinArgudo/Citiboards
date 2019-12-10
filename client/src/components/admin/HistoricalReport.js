import React, { Component } from 'react';
import MapGL, { Source, Layer, Marker, Popup } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ControlPanel from './ControlPanel';
import StationPin from './StationPin';
import StationInfo from './StationInfo';
import STATIONS from '../../JSON/stations.json';
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css';

const API_KEY = 'pk.eyJ1IjoiZWExNjc2IiwiYSI6ImNrM3hlN2xrZTBqdGszcnBpOXdjZmx1bGEifQ.QkOBRb_HcEVdnanOECp_jA';

export default class HistoricalReport extends Component {
    constructor(props){
        super(props)
        this.state = {
            viewport: {
                latitude: 40.7450,
                longitude: -73.9712,
                zoom: 12,
            },
            popupInfo: null,
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: []
                }
            },
            raw: []
        }
    }

    renderCityMarker = (site, index) => {
        return (
            <Marker key={index} longitude={site.longitude} latitude={site.latitude}>
                <StationPin size={20} onClick={() => this.setState({ popupInfo: site })} />
            </Marker>
        );
    };
    renderPopup() {
        const { popupInfo } = this.state;

        return (
            popupInfo && (
                <Popup
                tipSize={5}
                anchor="top"
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeOnClick={false}
                onClose={() => this.setState({ popupInfo: null })}
                >
                <StationInfo info={popupInfo} />
                </Popup>
            )
        );
    }

    updateData = () => {
        const url = `/api/v1/admin/historical-reports/${this.props.boardID}`
        console.log(url)
        axios.get(url)
        .then(res => {
            console.log(res)
            const data = res['data']['data']
            const coords = []

            for(let i = 0; i < data.length; i++){
                let d = data[i]
                let start = d['s_start'] - 1
                let end = d['s_end'] - 1
                if(start !== end){
                    let start_coord = [STATIONS[start]['longitude'], STATIONS[start]['latitude']]
                    let end_coord = [STATIONS[end]['longitude'], STATIONS[end]['latitude']]
                    coords.push(start_coord)
                    coords.push(end_coord)
                }
            }

            console.log(this)
            this.setState({
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coords
                    }
                },
                raw: data
            })
        })
    }

    componentDidMount(){
        this.updateData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.boardID !== prevProps.boardID) {
            this.updateData()
        }
    }

    render(){
        return (
            <MapGL
            style={{ width: '100%', height: '800px' }}
            mapStyle="mapbox://styles/mapbox/light-v9"
            accessToken={API_KEY}
            onViewportChange={(viewport) => this.setState({ viewport })}
            {...this.state.viewport}
            >
                <Source id="route" type="geojson" data={this.state.data} />
                <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                    'line-join': 'round',
                    'line-cap': 'round'
                }}
                paint={{
                    'line-color': '#FF5733',
                    'line-width': 8
                }}
                />
                {STATIONS.map(this.renderCityMarker)}

                {this.renderPopup()}
                <ControlPanel
                    containerComponent={this.props.containerComponent}
                    boardID={this.props.boardID}
                    data={this.state.raw}
                />
            </MapGL>);
        }
    }
