import "./Header.css"
import logo from "../../assets/logo.png"

import { Link } from "react-router-dom"
const Header = () => {
  return (
    <header className="header">
      <img src={logo}></img>
    </header>
  )
}

export default Header
