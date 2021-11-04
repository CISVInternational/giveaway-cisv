import React from "react"

import DataImport from "./containers/DataImport/DataImport"
import DataExport from "./containers/DataExport/DataExport"

import Giveaway from "./containers/Giveaway/Giveaway"
import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import Header from "./components/Header/Header"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <div>
        <div className="sticky-top">
          <Header />
          <NavBar />
        </div>

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <div className="body-container">
          <Switch>
            <Route path="/import">
              <DataImport />
            </Route>
            <Route path="/giveaway">
              <Giveaway />
            </Route>
            <Route path="/export">
              <DataExport />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  )
}

export default App
