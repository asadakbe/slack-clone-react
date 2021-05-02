import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import Messages from './components/Messages/Message_Components';
import SideBar from './components/SideBar/SideBar_component';

function App() {
  return (
    <Grid columns="equal">
      <SideBar />
      <Grid.Column className="messagepanel">
        <Messages />
      </Grid.Column>
      <Grid.Column width={3}>
        <span>

        </span>
      </Grid.Column>
    </Grid>
  );
}

export default App;
