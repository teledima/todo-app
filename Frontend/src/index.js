import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/normalize.css';
import App from './App';
import UserService from './api/UserService';

new UserService().GetUserInfo().then(data => {
  ReactDOM.render(
    <App data={data}/>,
    document.getElementById('root')
  );
})
