import React, {Component} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client'
import mapdata from './mapdata/umd.json';
import {each} from 'underscore';


class KoreaMap extends Component {
    render() {

        const width = 700, height = 700,
            proj = geoMercator()
                .translate([width / 2, height / 2])
                .scale(5500)
                .center([128.24005901199945, 35.86444105960784]),

            path = geoPath()
                .projection(proj);

        let pathitem = [];
        
        each(feature(mapdata, mapdata.objects.data).features, (data, index) => {
            pathitem.push(
                <path
                    key={index}
                    d={path(data)}
                ></path>
            );
        });
        return (
            <svg width={width} height={height}>
                {pathitem}
            </svg>
        )
    }
}

export default KoreaMap;