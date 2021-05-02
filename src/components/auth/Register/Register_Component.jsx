import React, {useState} from 'react';
import {Grid, Form, Segment, Icon, Header, Button, Message} from 'semantic-ui-react';
import '../Register/Auth.css'
import firebase from '../../../server/firebase';
import { Link } from 'react-router-dom';

const Register = () => {

    let user = {
        username: '',
        email: '',
        password: '',
        confirmpassword: ''
    }

    let errors = [];

    let userCollectionRef = firebase.database().ref('users');

    const [userState, setUserState] = useState(user);
    const [errorState, setErrorState] = useState(errors);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInput = (event) => {
        let target = event.target;
        setUserState((currentState) => {
            let currentUser = {...currentState};
            currentUser[target.name] = target.value;
            return currentUser;
        })
    }

    const checkForm = () => {
        if(isForEmpty()) {
            setErrorState((error) => error.concat({message: 'Please Fill Out All Fields'}))
            return false;
        }
        else if(!checkPassword()) {
            setErrorState((error) => error.concat({message: 'Given Password Is Not Valid'}))
            return false;
        }

        return true;
    }

    const isForEmpty = () => {
        return !userState.username.length ||
        !userState.password.length ||
        !userState.confirmpassword.length ||
        !userState.email.length;
    }

    const checkPassword = () => {
        if(userState.password.length < 8) {
            setErrorState((error) => error.concat({message: 'Password Length Should Be Greater Than 8'}))
            return false
        }

        else if(userState.password !== userState.confirmpassword) {
            setErrorState((error) => error.concat({message: 'Password and Confirm Password does not match'}))
            return false;
        }
        return true;
    }

    const onSubmit = (event) => {
        setErrorState(() => [])
        setIsSuccess(false);
        if(checkForm()) {
            setIsLoading(true);
            firebase.auth()
            .createUserWithEmailAndPassword(userState.email, userState.password)
            .then(createdUser => {
                updateuserDetails(createdUser);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                console.log(error);
            })
        }
        else {

        }
    }

    const updateuserDetails = (createdUser) => {
        if(createdUser) {
            setIsLoading(true);
            createdUser.user
            .updateProfile({
                displayName: userState.username,
                photoURL: `http://gravatar.com/avatar/${createdUser.user.uid}?d=identicon`
            })
            .then(() => {
                setIsLoading(false);
                saveUserInfo(createdUser)
            })
            .catch((serverError) => {
                setIsLoading(false);
                setErrorState((error) => error.concat(serverError))
            })
        }
    }
 
    const saveUserInfo = (createdUser) => {
        setIsLoading(true);
        userCollectionRef.child(createdUser.user.uid).set({
            displayName: createdUser.user.displayName,
            photoURL: createdUser.user.photoURL
        })
        .then(() => {
            setIsLoading(false);
            setIsSuccess(true);
        })
        .catch((serverError) => {
            setIsLoading(false);
            setErrorState((error) => error.concat(serverError))
        })
    }

    const formaterrors = () => {
       return errorState.map((error, index) => <p key={index}>{error.message}</p>)
    }

    return (
        <Grid verticalAlign="middle" textAlign="center" className="grid-form">
            <Grid.Column style={{maxWidth: '500px'}}>
                <Header icon as="h2">
                    <Icon name="slack" />
                    Register
                </Header>
                <Form onSubmit={onSubmit}>
                    <Segment stacked>
                        <Form.Input 
                            name="username"
                            value={userState.username}
                            icon="user"
                            iconPosition="left"
                            onChange={handleInput}
                            type="text"
                            placeholder="username..."
                        />

                        <Form.Input 
                            name="email"
                            value={userState.email}
                            icon="mail"
                            iconPosition="left"
                            onChange={handleInput}
                            type="email"
                            placeholder="email..."
                        />

                        <Form.Input 
                            name="password"
                            value={userState.password}
                            icon="lock"
                            iconPosition="left"
                            onChange={handleInput}
                            type="password"
                            placeholder="password..."
                        />

                        <Form.Input 
                            name="confirmpassword"
                            value={userState.confirmpassword}
                            icon="lock"
                            iconPosition="left"
                            onChange={handleInput}
                            type="password"
                            placeholder="confirmpassword..."
                        />
                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Submit</Button>
                </Form>
               {errorState.length > 0 && <Message error>
                    <h3>Errors</h3>
                    {formaterrors()}
                </Message>
                }

                {isSuccess && <Message success>
                    <h3>SuccessFully Register</h3>
                </Message>
                }   

                <Message>
                    Already an User? <Link to="/login">Login</Link>
                </Message>
                 
            </Grid.Column>
        </Grid>
    )
}

export default Register