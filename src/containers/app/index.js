import React from 'react';

import Home from '../home'
import Helloworld from '../helloworld'
import Signup from '../signup'
import { Route, Switch,BrowserRouter,Redirect } from 'react-router-dom'
import decode from 'jwt-decode';


const checkAuth = () =>{
	const token = sessionStorage.getItem('token');
	return !!token
}

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuth() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{ pathname: '/login'}} />
      
    )
  )}/>
)

export default () => (
  
  <BrowserRouter>
  	<Switch>
      <Route exact path="/login" render={props=><Helloworld {...props} />} />
      <Route exact path="/Signup" render={props=><Signup {...props} />} />
      <AuthRoute exact path="/" component={Home} />
    </Switch> 
  </BrowserRouter>
  
)








