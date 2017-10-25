import React, {Component} from 'react';
import Map from './Map';
import Navigation from './Navigation';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: '00',
            lat: 35.86444105960784,
            lng: 128.24005901199945,
            scale: 5500,
            width: 700,
            height: 700
        };

        this.changeArea = this.changeArea.bind(this);
    }

    render() {
        return (
            <div>
                <div>
                    <Navigation changeArea={this.changeArea}/>
                </div>
                <Map {...this.state}/>
            </div>
        );
    }

    changeArea(selected) {
        if (!/^(?=[0-9]*$)(?:.{2}|.{5}|.{7})$/.test(selected)) {
            return alert('숫자 2, 5, 7 글자만');
        }
        this.setState({selected});
    }
}

export default App;
