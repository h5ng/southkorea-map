import React, {Component} from 'react';
import {geoMercator, geoPath} from 'd3-geo';
import {zoom, zoomTransform} from 'd3-zoom';
import {select} from 'd3-selection'
import Map from './components/Map';
import Navigation from './components/Navigation';

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
        return (
            <div>
                <div>
                    <Navigation changeArea={this.changeArea}/>
                </div>
                <svg className="map-svg" width={this.state.width} height={this.state.height}>
                    <Map {...this.state}/>
                </svg>

            </div>
        );
    }

    componentDidMount() {
        console.log('component did mount!');
        select('.map-svg')
            .call(this.state.ZOOM);
    }

    componentDidUpdate() {
        console.log('component did update!');
    }

    changeArea = selected => {
        if (!/^(?=[0-9]*$)(?:.{2}|.{5}|.{7})$/.test(selected)) {
            return alert('숫자 2, 5, 7 글자만');
        }
        this.setState({selected});
    }
}

export default App;
