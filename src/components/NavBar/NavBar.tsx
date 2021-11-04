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
          <Link to="/giveaway">Sorteo</Link>
        </li>
        <li>
          <Link to="/export">Exportar resultados</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
