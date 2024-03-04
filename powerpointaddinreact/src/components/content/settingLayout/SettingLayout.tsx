import SettingContainer from '../settingContainer/SettingContainer'
import SettingsWrapper from '../settingsWrapper/SettingsWrapper'

const SettingLayout = ({ children, title = '' }: { children: React.ReactNode; title?: string }) => {
  return (
    <SettingsWrapper>
      <SettingContainer settingsTitle={title}>{children}</SettingContainer>
    </SettingsWrapper>
  )
}

export default SettingLayout
