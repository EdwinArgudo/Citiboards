import React, {PureComponent} from 'react';
import STATIONS from '../../JSON/stations.json';

const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

export default class ControlPanel extends PureComponent {

    constructor(props){
        super(props)
    }

    render() {
        const Container = this.props.containerComponent || defaultContainer;
        console.log(this.props.data)
        const report = this.props.data.map((entry) => {
            let start = entry['s_start'] - 1
            let end = entry['s_end'] - 1

            return (
                <div>
                    <p>
                        <b>{`On ${entry['date']}, ${entry['time']}:`}</b>
                        <br />
                        {`Travelled Between ${STATIONS[start]['site']} and ${STATIONS[end]['site']} in ${entry['duration']} mins`}
                    </p>
                </div>
            )
        })

        return (
            <Container>
                <h3>Historical Report of Board { this.props.boardID }</h3>
                {report}
            </Container>
        );
    }
}
