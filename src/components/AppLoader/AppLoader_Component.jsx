import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import './AppLoader.css';

const AppLoader = (props) => {
    return (
        <Dimmer active={props.loading}>
            <Loader size="large" content="loading..." />
        </Dimmer>
    )
}

export default AppLoader;