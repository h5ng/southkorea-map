import React from 'react';
import {merge} from 'topojson-client'
import {each} from 'underscore';

import '../assets/css/Map.css';
import umd from '../assets/umd.json';

const Map = ({topojson, selected, PATH}) => {
    const path_elements = [];
    each(topojson, (data, index) => {
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