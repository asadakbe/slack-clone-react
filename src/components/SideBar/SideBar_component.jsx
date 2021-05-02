import React from 'react';
import { Menu } from 'semantic-ui-react';
import './SideBar.css';
import UserInfo from './UserInfo/UserInfo_component';
import Channels from './Channels/channels_components';
import PrivateChat from '../PrivateChat/PrivateChat_Component';
import FavouriteChannels from '../FavouriteChannels/FavouriteChannels_Componets';

const SideBar = () => {
    return(
        <Menu vertical fixed="left" borderless size="large" className="side_bar">
            <UserInfo />
            <FavouriteChannels />
            <Channels />
            <PrivateChat />
        </Menu>

    )
}

export default SideBar;