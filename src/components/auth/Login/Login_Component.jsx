import React, {useState} from 'react';
import {Grid, Form, Segment, Icon, Header, Button, Message} from 'semantic-ui-react';
import '../Register/Auth.css'
import firebase from '../../../server/firebase';
import { Link } from 'react-router-dom';

const Login = () => {

    let user = {
        email: '',
        password: '',
    }

    let errors = [];

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
        return true;
    }


    const isForEmpty = () => {
        return !userState.email.length ||
        !userState.password.length;
      
    }

    const onSubmit = (event) => {
        setErrorState(() => [])
        setIsSuccess(false);
        if(checkForm()) {
            setIsLoading(true);
            firebase.auth()
            .signInWithEmailAndPassword(userState.email, userState.password)
            .then(user => {
                setIsLoading(false);
                setIsSuccess(true);
                console.log(user);
            })
            .catch(serverError => {
                setIsLoading(false);
                setErrorState((error) => error.concat(serverError))
            })
        }
    }

    const formaterrors = () => {
        return errorState.map((error, index) => <p key={index}>{error.message}</p>)
     }



    return (
        <Grid verticalAlign="middle" textAlign="center" className="grid-form">
            <Grid.Column style={{maxWidth: '500px'}}>
                <Header icon as="h2">
                    <Icon name="slack" />
                    Login
                </Header>
                <Form onSubmit={onSubmit}>
                    <Segment stacked>
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

                    </Segment>
                    <Button disabled={isLoading} loading={isLoading}>Login</Button>
                </Form>
                {errorState.length > 0 && <Message error>
                    <h3>Errors</h3>
                    {formaterrors()}
                </Message>
                }

                {isSuccess && <Message success>
                    <h3>SuccessFully Login</h3>
                </Message>
                }   
 
                <Message>
                    Not an User? <Link to="/register">Register</Link>
                </Message>
                 
            </Grid.Column>
        </Grid>
    )
}

export default Login