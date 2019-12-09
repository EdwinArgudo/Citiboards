import React, {PureComponent} from 'react';

export default class StationInfo extends PureComponent {
    render() {
        const {info} = this.props;

        return (
            <div>
                <div>
                    <p>
                        <b>{info.site}</b>, {info.city}
                    </p>
                </div>
                <img width={200} src={info.image} />
            </div>
        );
    }
}
