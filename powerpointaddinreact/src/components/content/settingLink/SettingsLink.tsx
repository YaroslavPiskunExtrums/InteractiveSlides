import styles from './settingLink.module.scss'

interface IProps {
  title: string
  link: string
}

const SettingLink = (props: IProps) => {
  return (
    <a href={props.link} className={styles.linkContainer}>
      <span className={styles.linkSpan} />
      <div className={styles.linkTitle}>{props.title}</div>
    </a>
  )
}

export default SettingLink
