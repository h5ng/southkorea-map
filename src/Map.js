import React, {Component} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client'
import {each} from 'underscore';

import umd from './mapdata/umd.json';

class Map extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const width = this.props.width,
            height = this.props.height,
            proj = geoMercator()
                .translate([width / 2, height / 2])
                .scale(this.props.scale)
                .center([this.props.lng, this.props.lat]),
            path = geoPath()
                .projection(proj),
            path_elements = [];

        each(feature(umd, umd.objects.data).features, (data, index) => {
            path_elements.push(
                <path
                    key={index}
                    d={path(data)}
                />);
        });

        return (
            <svg width={width} height={height}>
                {path_elements}
            </svg>
        )
    }
}

export default Map;