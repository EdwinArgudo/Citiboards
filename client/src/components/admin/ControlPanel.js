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
        if(this.props.missing){
            const report = this.props.data.map((entry) => {
                let pos = entry['station_id'] - 1
                return (
                    <div>
                        <p>
                            <b>{`Board ${entry['board_id']}:`}</b>
                            <br />
                            {`Last Seen at ${STATIONS[pos]['site']}`}
                            <br />
                            {`On ${entry['last_transaction_date']}, ${entry['last_transaction_time']}`}
                        </p>
                    </div>
                )
            })

            return (
                <Container>
                    <h3>Missing Boards Report</h3>
                    {report}
                </Container>
            );
        } else {
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
}
