import DataImport from "./containers/DataImport/DataImport"
import DataExport from "./containers/DataExport/DataExport"

import Giveaway from "./containers/Giveaway/Giveaway"
import "./App.css"
import NavBar from "./components/NavBar/NavBar"
import Header from "./components/Header/Header"
import { Switch, Route, Redirect } from "react-router-dom"
import "react-modern-drawer/dist/index.css"

function App() {
  return (
    <div>
      <div className="sticky-top">
        <Header />
        <NavBar />
      </div>
      <div className="body-container">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/import" />} />
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
  )
}

export default App
