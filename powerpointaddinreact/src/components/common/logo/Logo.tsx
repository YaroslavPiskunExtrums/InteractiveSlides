import LogoImg from '@assets/logo.png'
import classes from './logo.module.scss'
interface IProps {
  marginBottom?: string
}

const Logo = ({ marginBottom = '3rem' }: IProps) => {
  return (
    <img src={LogoImg} alt="logo" className={classes.logo} style={{ marginBottom: marginBottom }} />
  )
}

export default Logo
