import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { Button, Form, Icon, Menu, Modal, Segment } from 'semantic-ui-react';
import firebase from '../../../server/firebase';
import './channels.css';
import { setChannel } from '../../../store/actioncreator';
import  Notification  from '../Notification/notification_component';

const Channels = (props) => {
    
    const [modelOpenState, setModelOpenState] = useState(false);
    const [channelAddState, setChannelAddState] = useState({Name: "", Description: ""});
    const [IsLoadingState, SetIsLoadingState] = useState(false);
    const [channelsState, setChannelsState] = useState([]);

    const channelsRef = firebase.database().ref('channels')

    
    const usersRef = firebase.database().ref('users')

    useEffect(() => {
        channelsRef.on('child_added', (snap) => {
           setChannelsState((currentState) => {
               let updateState = [...currentState];
               updateState.push(snap.val());
               if(updateState.length === 1) {
                    props.selectChannel(updateState[0])
               }
               return updateState;
           })
        });
        return () => channelsRef.off();
    }, [])

    useEffect(() => {
        if(channelsState.length > 0) {
            props.selectChannel(channelsState[0])
        }
    }, [!props.channel ? channelsState: null])

    const openModal = () => {
        setModelOpenState(true)
    }

    const closeModal = () => {
        setModelOpenState(false)
    }

    const onSubmit = () => {
        if(!checkIfformValid()) {
            return;
        }

        const key = channelsRef.push().key;

        const channel = {
            id: key,
            name: channelAddState.Name,
            description: channelAddState.Description,
            created_by: {
                name: props.user.displayName,
                avatar: props.user.photoURL
            }
        }
        SetIsLoadingState(true)
        channelsRef.child(key)
        .update(channel)
        .then(() => {
            SetIsLoadingState(false)
            setChannelAddState({Name: '', Description: ''})
            closeModal();
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const checkIfformValid = () => {
        return channelAddState && channelAddState.Name && channelAddState.Description;
    }

    const displayChannels = () => {
        if(channelsState.length > 0) {
           return channelsState.map((channel) => {
                return <Menu.Item className="channel"
                    key = {channel.id}
                    name = {channel.name}
                    onClick={() => props.selectChannel(channel)}
                    active={props.channel && channel.id === props.channel.id && !props.channel.isFavourite}
                >
                 
                 <Notification user={props.user} channel={props.channel}
                        notificationChannelId={channel.id}
                        displayName={"# " + channel.name} />
                </Menu.Item>
            })
        }
    }

    const selectChannel = (channel) => {
        setLastVisited(props.user, props.channel)
        setLastVisited(props.user, channel)
        props.selectChannel(channel)
    }

    const setLastVisited = (user, channel) => {
        const lastVisited = usersRef.child(user.uid).child("lastVisited").child(channel.id)
        lastVisited.set(firebase.database.ServerValue.TIMESTAMP);
        lastVisited.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
    }

    const handleInput = (e) => {
        let target = e.target;
        setChannelAddState((currentState) => {
            let updatedstate = {...currentState};
            updatedstate[target.name] = target.value;
            return updatedstate;
        })
    }

    return <> <Menu.Menu style={{marginTop: '35px'}}>
        <Menu.Item style={{fontSize: '17px'}}>
            <span className="clickable">
                <Icon name="exchange" /> channels
               ({channelsState.length})
            </span>
   
        </Menu.Item>
        {displayChannels()}
        <Menu.Item>
            <span className="clickable" onClick={openModal}>
                <Icon name="add"  /> ADD
            </span>
        </Menu.Item>
    </Menu.Menu>
        <Modal open={modelOpenState} onClose={closeModal}>
            <Modal.Header>
                Create Channel
            </Modal.Header>

            <Modal.Content>
                <Form onSubmit={onSubmit}>
                    <Segment stacked>
                        <Form.Input
                            name="Name"
                            value={channelAddState.Name}
                            onChange={handleInput}
                            type="text"
                            placeholder="Enter Channel Name"
                        />

                        <Form.Input
                            name="Description"
                            value={channelAddState.Description}
                            onChange={handleInput}
                            type="text"
                            placeholder="Enter Channel Description"
                        />
                    </Segment>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button loading={IsLoadingState} onClick={onSubmit}>
                    <Icon name="checkmark" /> save
                </Button>
                <Button onClick={closeModal}>
                    <Icon name="remove" /> Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    </>
}

const mapStateToProps = (state) => {
    return {
        user: state.user.currentUser,
        channel: state.channel.currentChannel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectChannel: (channel) => dispatch(setChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Channels);