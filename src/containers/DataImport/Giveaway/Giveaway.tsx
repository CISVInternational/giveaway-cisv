import { useHistory } from "react-router-dom"

const Giveaway = () => {
  const history = useHistory()
  const goToGiveaway = () => {
    history.push("/giveaway")
  }

  return (
    <div className="row">
      <div className="row__cell--1 margin-bottom">
        <button onClick={goToGiveaway}>Ir al sorteo</button>
      </div>
    </div>
  )
}

export default Giveaway
