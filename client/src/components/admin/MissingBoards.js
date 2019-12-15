import React, { Component } from 'react';
import MapGL, { Source, Layer } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ControlPanel from './ControlPanel';
import STATIONS from '../../JSON/stations.json';
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css';

const API_KEY = 'pk.eyJ1IjoiZWExNjc2IiwiYSI6ImNrM3hlN2xrZTBqdGszcnBpOXdjZmx1bGEifQ.QkOBRb_HcEVdnanOECp_jA';

export default class MissingBoards extends Component {
    constructor(props){
        super(props)
        this.state = {
            viewport: {
                latitude: 40.7450,
                longitude: -73.9712,
                zoom: 12,
            },
            data: {
                type: "FeatureCollection",
                "features": []
            },
            raw: []
        }
    }

    updateData = () => {
        axios.get('/api/v1/admin/missing-boards')
        .then(res => {
            console.log(res)
            const data = res['data']['missing_boards']
            const points = []
            for(let i = 0; i < data.length; i++){
                let d = data[i]
                let pos = d['station_id'] - 1
                let coord = [STATIONS[pos]['longitude'], STATIONS[pos]['latitude']]
                points.push({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: coord
                    },
                    properties: {
                        title: `Board ${d['board_id']}`,
                        icon: "volcano"
                    }
                })

            }

            this.setState({
                data: {
                    type: "FeatureCollection",
                    "features": points
                },
                raw: data
            })
        })
    }

    componentDidMount(){
        this.updateData()
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.boardID !== prevProps.boardID) {
    //         this.updateData()
    //     }
    // }

    render(){
        return (
            <MapGL
            style={{ width: '100%', height: '800px' }}
            mapStyle="mapbox://styles/mapbox/light-v9"
            accessToken={API_KEY}
            onViewportChange={(viewport) => this.setState({ viewport })}
            {...this.state.viewport}
            >
                <Source id="points" type="geojson" data={this.state.data} />
                <Layer
                id="points"
                type="symbol"
                source="points"
                layout={{
                    "icon-image": ["concat", ["get", "icon"], "-15"],
                    "icon-size":1.5,
                    "text-field": ["get", "title"],
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                }}
                />

                <ControlPanel
                    containerComponent={this.props.containerComponent}
                    missing={true}
                    data={this.state.raw}
                />
            </MapGL>);
        }
    }
    //
    // <ControlPanel
    //     containerComponent={this.props.containerComponent}
    //     boardID={this.props.boardID}
    //     data={this.state.raw}
    // />
