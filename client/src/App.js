import React, { useContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Views from './views';
import { Route, Switch } from 'react-router-dom';
import { UserContext } from 'hooks/UserContextProvider';

function App() {
  
  const { loading } = useContext(UserContext)

  if (loading) {
    return null
  }

  return (
    <Router>
      <Switch>
        <Route path="/" component={Views}/>
      </Switch>
    </Router>
  );
}

export default App;
