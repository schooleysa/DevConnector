import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if(localStorage.token){
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
      store.dispatch(loadUser());
  }, []);

  return(
    <Provider store={store}>
  <Router >
<Fragment>
    <NavBar />
    <Route path='/' component={Landing} />
    <section className="container">
      <Alert />
      <Routes >
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
      </Routes >
    </section>
    <Route path='/' component={Landing} />

  </Fragment>
  </Router >
  </Provider>
  );
}

export default App;
