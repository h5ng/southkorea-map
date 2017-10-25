import React, {Component} from 'react';
import Map from './Map';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '11',
            lat: 35.86444105960784,
            lng: 128.24005901199945,
            scale: 5500,
            width: 700,
            height: 700
        };
    }

    render() {
        return (
            <Map {...this.state}/>
        );
    }
}

export default App;
