import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/navbar.component";
import OrdersList from "./components/orders-list.component";
import EditOrder from "./components/edit-order.component";
import CreateOrder from "./components/create-order.component";


function App() {
  return (
    <Router>
      {/* <div className="container"> */}
        <Navbar /> 
        <br/> 
        <Route path="/" exact component={OrdersList}/>
        <Route path="/edit/:id" component={EditOrder}/>
        {/* <Route path="/create" component={CreateOrder}/> */}
      {/* </div> */}
    </Router>
  );
}

export default App;
