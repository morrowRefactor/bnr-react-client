import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenService from '../services/token-service';
import jwt_decode from 'jwt-decode';

export default function PrivateRoute({ component, ...props }) {
  const Component = component;
  const token = TokenService.getAuthToken();
  const user = jwt_decode(token);
  const userID = user.id || user.user_id;
  
  return (
    <Route
      {...props}
      render={componentProps => (
        userID === 1
          ? <Component {...componentProps} />
          : <Redirect
              to={{
                pathname: '/',
                state: { from: componentProps.location }
              }}
            />
      )}
    />
  )
};