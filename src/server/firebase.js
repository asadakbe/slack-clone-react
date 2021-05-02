import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyAJLIa1qoziRrtVRWb5iCGOQIIJLKaJghI",
    authDomain: "slack-clone-react-9122b.firebaseapp.com",
    projectId: "slack-clone-react-9122b",
    storageBucket: "slack-clone-react-9122b.appspot.com",
    messagingSenderId: "833252350632",
    appId: "1:833252350632:web:ac183b9186006a6955009d",
    measurementId: "G-27REZKZX8S"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
