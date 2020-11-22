import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import { BrowserRouter } from 'react-router-dom';
import Router from "./Router";

ReactDOM.render(
  <BrowserRouter>
    <Router/>
  </BrowserRouter>,
  document.getElementById('root')
);
