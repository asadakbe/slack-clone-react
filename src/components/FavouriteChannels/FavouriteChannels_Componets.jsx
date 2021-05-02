import React from 'react';
import {connect} from 'react-redux';
import { Icon, Menu, } from 'semantic-ui-react';
import { setChannel } from '../../store/actioncreator';

const FavouriteChannels = (props) => {
    
    const displayChannels = () => {
        if(Object.keys(props.favouriteChannel).length > 0) {
           return Object.keys(props.favouriteChannel).map((channelId) => {
                return <Menu.Item className="channel"
                    key = {channelId}
                    name = {props.favouriteChannel[channelId]}
                    onClick={() => props.selectChannel({id: channelId, name: props.favouriteChannel[channelId], isFavourite: true})}
                    active={props.channel && channelId === props.channel.id && props.channel.isFavourite}
                >
                {"@" + props.favouriteChannel[channelId]}
                </Menu.Item>
            })
        }
    }

    return  <Menu.Menu>
        <Menu.Item style={{fontSize: '17px'}}>
            <span className="clickable">
                <Icon name="star" /> starred
               ({Object.keys(props.favouriteChannel).length})
            </span>
   
        </Menu.Item>
        {displayChannels()}
    </Menu.Menu>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        favouriteChannel: state.favouriteChannel.favouriteChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteChannels);