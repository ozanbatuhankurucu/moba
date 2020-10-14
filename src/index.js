import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify from 'aws-amplify';
import aws_exports from '../src/aws-exports.js';

Amplify.configure(aws_exports);
ReactDOM.render(
  
    <App />
  ,
  document.getElementById('root')
);

