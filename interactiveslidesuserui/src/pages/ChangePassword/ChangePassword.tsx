import { Card, Col, Container, Row } from 'reactstrap'
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth'
import { useEffect, useMemo, useState } from 'react'
import ChangePasswordForm from './components/ChangePasswordForm'
import Spinner from 'src/Components/Common/Spinner'
import { checkLink } from 'src/lib/api/changePassword'
import { useLocation } from 'react-router-dom'
import IncorrectLink from './components/IncorrectLink'

function useQuery() {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const ChangePasswordPage = () => {
  const query = useQuery()
  const [isCorrectLink, setIsCorrectLink] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkLinkToExisting = async (link: string) => {
    setIsLoading(true)
    try {
      await checkLink(link)
      setIsCorrectLink(true)
    } catch (e) {
      setIsCorrectLink(false)
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const link = query.get('link')
    if (!link) {
      setIsCorrectLink(false)
      setIsLoading(false)
      return
    }
    checkLinkToExisting(link)
  }, [])

  const pageType = {
    true: <ChangePasswordForm link={query.get('link')} />,
    false: <IncorrectLink />,
  }

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4" style={{ minHeight: '360px' }}>
                {isLoading ? <Spinner /> : pageType[String(isCorrectLink)]}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  )
}

export default ChangePasswordPage
