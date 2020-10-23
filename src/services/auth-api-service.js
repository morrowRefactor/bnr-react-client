import TokenService from './token-service';
import config from '../config';

const AuthApiService = {
  postComment(articleId, text) {
    return fetch(`${config.API_ENDPOINT}/api/comments`, {
        method: 'POST',
        headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
        },
        body: JSON.stringify({
        article_id: articleId,
        text,
        }),
    })
        .then(res =>
        (!res.ok)
            ? res.json().then(e => Promise.reject(e))
            : res.json()
        )
  },
  postLogin(credentials) {
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    .then(res =>
      (!res.ok)
      ? res.json().then(e => Promise.reject(e))
      : res.json()
    )
  }
}

export default AuthApiService;