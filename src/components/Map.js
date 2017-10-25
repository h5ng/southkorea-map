import React from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {merge} from 'topojson-client'
import {each, groupBy} from 'underscore';

import '../assets/css/Map.css';
import umd from '../assets/umd.json';

const Map = ({width, height, scale, lat, lng, selected}) => {
    const proj = geoMercator()
            .translate([width / 2, height / 2])
            .scale(scale)
            .center([lng, lat]),
        path = geoPath()
            .projection(proj),
        path_elements = [];

    const grouping = groupBy(umd.objects.data.geometries, function (d) {
        let code = d.properties.code,
            sd_code = code.substring(0, 2),
            sgg_code = code.substring(0, 5),
            umd_code = code.substring(0, 7);

        return sgg_code === selected ? umd_code : sd_code === selected.substring(0, 2) ? sgg_code : sd_code;
    });

    each(grouping, (data, index) => {
        const merge_area = merge(umd, data);
        path_elements.push(
            <path className={selected === '00' ? 'selected' : index.includes(selected, 0) ? 'selected' : ''}
                  key={index} d={path(merge_area)}></path>
        );
    });

    return (
        <svg width={width} height={height}>
            {path_elements}
        </svg>
    );
}

export default Map;