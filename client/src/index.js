import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
/*
const searchBar = (props) => {
    reutrn (
        <>
        <label htmlFor='search'> Search by Username or Game </label>
        <input type='text' value={props.inputValue} onChange={props.onChange}/>
    )
}
*/

ReactDOM.render(
<App />, 
    
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
