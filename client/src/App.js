import React from 'react';
import { 
  BrowserRouter as Router, 
  Switch, 
  Route, 
  Link,
  NavLink
} from 'react-router-dom';
import PostsListPage from './pages/PostsListPage';
import PostFormPage from './pages/PostFormPage';
import ShowPostPage from './pages/ShowPostPage';
import AboutUsPage from './pages/AboutUsPage';
import LoginPage from './pages/LoginPage';

import './App.css';

document.body.style = 'background: #0C1221;';
const styles= {
  color: '#E84637',
  backgroundColor: "#0C1221",
  fontWeight: "bold",
};



function Navigation(props) {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3" >
      <Link className="navbar-brand" to="/" style={styles}>GAMEDIA</Link>
      <ul className="navbar-nav mr-auto" style={styles}>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/posts/new">
            Upload
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" exact to="/about-us">
            About Us
          </NavLink>
        </li>
      </ul>
      <form class="d-flex input-group w-auto">
        <input
          type="search"
          class="form-control"
          placeholder="Search"
          aria-label="Search"
        />
        <button
          class="btn btn-outline-primary"
          type="button"
          data-mdb-ripple-color="dark"
        >
          Search
        </button>
      </form>

        <span class="navbar-text">
              <NavLink exact activeClassName="active" className="nav-link" to="/login">Login</NavLink>            
        </span>
    </nav>
  );
}

class App extends React.Component {
  render() {
    return (
      
        <Router>
          <Navigation />
        
          <div className="container-fluid text-center">
            <div className="row justify-content-center">
              <Switch>
                <Route path="/posts/new" component={PostFormPage} />
                <Route path="/posts/:id" component={ShowPostPage} />
                <Route path="/about-us" component={AboutUsPage} />
                <Route exact path="/login" component={LoginPage} />
                <Route path="/" component={PostsListPage} />
            
              </Switch>
            </div>
            </div>
        </Router>
        
    );
  }
}



export default App;
