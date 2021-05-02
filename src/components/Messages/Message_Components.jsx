import React, {useEffect, useState, useRef, } from 'react';
import MessageHeader from './MessageHeader/Message_Header';
import MessageContent from './MessageContent/Message_Content';
import MessageInput from './MessageInput/MessageInput_Component';
import { connect } from 'react-redux';
import firebase from '../../server/firebase';
import { Segment, Comment } from 'semantic-ui-react';
import { setFavouriteChannel, removeFavouriteChannel } from '../../store/actioncreator';
import './Messages.css';

const Messages = (props) => {
    const messageRef = firebase.database().ref('messages')

    const usersRef = firebase.database().ref('users')

    const [messageState, setMessageState] = useState([]);

    const [searchTermState, setSearchTermState] = useState("");

    // let divRef = useRef();

    useEffect(() => {
        if(props.channel) {
        setMessageState([]);
        messageRef.child(props.channel.id).on('child_added', (snap) => {
            setMessageState((currentState) => {
                let updatedState = [...currentState];
                updatedState.push(snap.val());
                return updatedState;
            })
        })
        return () => messageRef.child(props.channel.id).off()
    }
    }, [props.channel])

    useEffect(() => {
        if(props.user) {
            usersRef.child(props.user.uid).child('favourite')
            .on('child_added', (snap) => {
                props.setFavouriteChannel(snap.val())
            })

            usersRef.child(props.user.uid).child('favourite')
            .on('child_removed', (snap) => {
                props.removeFavouriteChannel(snap.val())
            })
        return () => usersRef.child(props.user.uid).child('favourite').off()
    }
    }, [props.user])

    // useEffect(() => {
    //     divRef.scrollIntoView({behavior: "Smooth"})
    // }, [messageState])

    const displayMessages = () => {
        let messagesToDisplay = searchTermState ? filterMessageBySearchTerm() : messageState
        if(messagesToDisplay.length > 0) {
           return messagesToDisplay.map((message) => {
               return <MessageContent ownMessage={message.user.id === props.user.uid} key={message.timestamp} message={message} />
            })
        }
    }

    const uniqueUsersCount = () => {
        const uniqueUsers = messageState.reduce((acc, message) => {
            if(!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        return uniqueUsers.length;
    }

    const searchTermChange = (e) => {
        const target = e.target;
        setSearchTermState(target.value);
    }

    const filterMessageBySearchTerm = () => {
        const regex = new RegExp(searchTermState, "gi")
        const messages = messageState.reduce((acc, message) => {
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        return messages;
    }

    const starChange = () => {
        let favouriteRef = usersRef.child(props.user.uid).child("favourite").child(props.channel.id)
        if(isStarred()) {
            favouriteRef.remove()
        } else {
            favouriteRef.set({channelId: props.channel.id, channelName: props.channel.name})
        }
    }

    const isStarred = () => {
        return Object.keys(props.favouriteChannel).includes(props.channel.id);
    }

    return <div className="messages">
        <MessageHeader starChange={starChange} isPrivateChat={props.channel?.isPrivateChat} searchTermChange={searchTermChange} channelName={props.channel?.name} uniqueUsers={uniqueUsersCount()} />
        <Segment className="messagecontent">
            <Comment.Group>
                {displayMessages()}
                {/* <div ref={currentEl => divRef = currentEl}></div> */}
            </Comment.Group>
        </Segment>
        <MessageInput />
    </div>
}

const mapStateToProps = (state) => {
    return {
        channel: state.channel.currentChannel,
        user: state.user.currentUser,
        favouriteChannel: state.favouriteChannel.favouriteChannel

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setFavouriteChannel: (channel) => dispatch(setFavouriteChannel(channel)),
        removeFavouriteChannel: (channel) => dispatch(removeFavouriteChannel(channel))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages);