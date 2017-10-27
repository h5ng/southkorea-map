import React from 'react';

import {merge} from 'topojson-client'
import {each, groupBy} from 'underscore';

import '../assets/css/Map.css';
import umd from '../assets/umd.json';

const Map = ({selected, PATH}) => {
    const path_elements = [],
        grouping = groupBy(umd.objects.data.geometries, d => {
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
                  key={index} d={PATH(merge_area)}></path>
        );
    });

    return (
        <g>{path_elements}</g>
    );
}

export default Map;