import { Card } from "react-bootstrap"

export default function TeamMemberCard({ nombre, rol, foto }) {
  const onImgError = (e) => {
    e.currentTarget.style.display = "none"
  }

  return (
    <Card className="h-100 text-center border-0 shadow-sm card-hover">
      <div className="team-photo d-flex justify-content-center align-items-center">
        {foto ? (
          <img src={foto} alt={nombre} onError={onImgError} />
        ) : (
          <div className="text-muted">Sin foto</div>
        )}
      </div>

      <Card.Body>
        <h6 className="mb-1">{nombre}</h6>
        <small className="text-muted">{rol}</small>
      </Card.Body>
    </Card>
  )
}
