import { SET_USER, SET_CHANNEL, SET_FAVOURITE_CHANNEL, REMOVE_FAVOURITE_CHANNEL } from './actiontypes';
import { combineReducers } from 'redux';

let defaultUserstate = {
    currentUser: null
}

const userReducer = (state = defaultUserstate, action) => {
    if(action.type === SET_USER) {
        let payload = action.payload;
        state = {...payload};
        return state;
    }
    return state;
}

let defaultChannelstate = {
    currentChannel: null,
    loading: true
}

const channelReducer = (state = defaultChannelstate, action) => {
    if(action.type === SET_CHANNEL) {
        let payload = action.payload;
        state = {...payload};
        state.loading = false
        return state;
    }
    return state;
}

let defaultFavouritestate = {
    favouriteChannel: {}
}

const favouriteChannelReducer = (state = defaultFavouritestate, action) => {
    if(action.type === SET_FAVOURITE_CHANNEL) {
        let payload = action.payload.favouriteChannel;
        let updatedState = {...state.favouriteChannel};
        updatedState[payload.channelId] = payload.channelName;
        return  {favouriteChannel: updatedState};
    } 
    else if(action.type === REMOVE_FAVOURITE_CHANNEL) {
        let payload = action.payload.favouriteChannel;
        let updatedState = {...state.favouriteChannel};
        delete updatedState[payload.channelId]
        return  {favouriteChannel: updatedState};
    } 
    return state;
}


export const combinedReducers = combineReducers({user: userReducer, channel: channelReducer, favouriteChannel: favouriteChannelReducer})