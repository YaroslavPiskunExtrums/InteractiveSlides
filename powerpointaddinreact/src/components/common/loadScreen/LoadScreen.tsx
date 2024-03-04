import { MouseEvent } from 'react'
import Logo from '@components/common/logo/Logo'
import LinkBtn from '@components/common/linkBtn/LinkBtn'
import classes from './loadScreen.module.scss'

interface IProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

const LoadScreen = (props: IProps) => {
  return (
    <div className={classes.wrapper}>
      <Logo marginBottom="0px" />
      <div>
        <h2 className={classes.title}>Welcome to SlideX</h2>
        <p className={classes.text}>
          SlideX is a PowerPoint add-in that allows you to create interactive presentations.
        </p>
      </div>
      <LinkBtn onClick={props.onClick}>Get Started</LinkBtn>
    </div>
  )
}
export default LoadScreen
