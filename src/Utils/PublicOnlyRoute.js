import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import TokenService from '../services/token-service';
import jwt_decode from 'jwt-decode';

export default function PublicOnlyRoute({ component, ...props }) {
  const Component = component;
  let user_id;
  if(TokenService.hasAuthToken()) {
    const token = TokenService.getAuthToken();
    const user = jwt_decode(token);
    user_id = user.user_id
  }
  
  return (
    <Route
      {...props}
      render={componentProps => (
        TokenService.hasAuthToken()
            ? <Redirect to={`/user/${user_id}`} />
            : <Component {...componentProps} />
        )}
    />
  )
};