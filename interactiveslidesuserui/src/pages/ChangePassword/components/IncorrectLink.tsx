import { Link } from 'react-router-dom'
import { Alert } from 'reactstrap'

const IncorrectLink = () => {
  return (
    <div className="d-flex justify-content-center align-items-center flex-grow-1 flex-column">
      <Alert className="alert-borderless alert-warning text-center" role="alert">
        Link to change password is wrong
      </Alert>
      <div className="d-flex gap-1 w-100 justify-content-center">
        <span>Go to</span>
        <Link to={'/login'} className="fw-semibold text-primary text-decoration-underline">
          login
        </Link>
      </div>
    </div>
  )
}

export default IncorrectLink
