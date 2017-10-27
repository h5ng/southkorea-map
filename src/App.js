import React, {Component} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {zoom, zoomTransform, zoomIdentity} from 'd3-zoom';
import {select} from 'd3-selection'
import {each, groupBy, pick} from 'underscore';
import {merge} from 'topojson-client';

import Map from './components/Map';
import Navigation from './components/Navigation';
import umd from './assets/umd.json';

class App extends Component {
    constructor(props) {
        super(props);
        const selected = '00',
            lat = 35.86444105960784,
            lng = 128.24005901199945,
            scale = 5500,
            width = 700,
            height = 700,
            PROJECTION = geoMercator()
                .translate([width / 2, height / 2])
                .scale(scale)
                .center([lng, lat]),
            PATH = geoPath()
                .projection(PROJECTION),
            ZOOM = zoom()
                .scaleExtent([1, 50])
                .on('zoom', function () {
                    let transform = zoomTransform(this),
                        tx = Math.min(0, Math.max(transform.x, width - width * transform.k)),
                        ty = Math.min(0, Math.max(transform.y, height - height * transform.k));

                    transform.x = tx;
                    transform.y = ty;

                    select('.map-svg > g')
                        .attr('transform', `translate(${tx}, ${ty})scale(${transform.k})`)
                });

        this.state = {selected, lat, lng, scale, width, height, PROJECTION, PATH, ZOOM};
    }

    render() {
        const selected = this.state.selected,
            topojson = this.state.topojson,
            PATH = this.state.PATH;

        return (
            <div>
                <div>
                    <Navigation changeArea={this.changeArea}/>
                </div>
                <svg className="map-svg" width={this.state.width} height={this.state.height}>
                    <Map selected={selected} PATH={PATH} topojson={topojson}/>
                </svg>

            </div>
        );
    }

    componentDidMount() {
        select('.map-svg')
            .call(this.state.ZOOM);

        this.changeArea(this.state.selected);
    }

    componentDidUpdate() {

        // 선택한 지역의 topojson 값만 가져온다.
        const selectedArea = pick(this.state.topojson, (value, key) => {
            return this.state.selected === '00' ? true : key.includes(this.state.selected, 0);
        });

        this.animate(selectedArea);
    }

    changeArea = selected => {
        if (!/^(?=[0-9]*$)(?:.{2}|.{5}|.{7})$/.test(selected)) {
            return alert('숫자 2, 5, 7 글자만');
        }

        const topojson = this.getTopojson(selected);
        this.setState({selected, topojson});
    };

    getTopojson = (selected) => {
        const topojson = groupBy(umd.objects.data.geometries, d => {
            let code = d.properties.code,
                sd_code = code.substring(0, 2),
                sgg_code = code.substring(0, 5),
                umd_code = code.substring(0, 7);

            return sgg_code === selected ? umd_code : sd_code === selected.substring(0, 2) ? sgg_code : sd_code;
        });

        return topojson;
    };

    animate = d => {
        let topojson = [];
        each(d, data => {
            topojson = [...topojson, ...data]
        });

        const mergeTopojson = merge(umd, topojson),
            bounds = this.state.PATH.bounds(mergeTopojson),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(50, 0.9 / Math.max(dx / this.state.width, dy / this.state.height))),
            translate = [this.state.width / 2 - scale * x, this.state.height / 2 - scale * y];

        select('.map-svg')
            .transition()
            .duration(1000)
            .call(this.state.ZOOM.transform, zoomIdentity.translate(translate[0], translate[1]).scale(scale))
    }

}

export default App;
