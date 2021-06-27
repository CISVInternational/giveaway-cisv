import "./NavBar.css"

import { Link } from "react-router-dom"
const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/import">Import Data</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
