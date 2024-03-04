import FigureListContainer from '@components/content/figureListContainer/FigureListContainer'
import SettingLink from '@components/content/settingLink/SettingsLink'
import SettingsWrapper from '@components/content/settingsWrapper/SettingsWrapper'
import { figuresSettingsList } from '@lib/routes/routes.enum'

const FigureList = () => {
  return (
    <SettingsWrapper>
      <FigureListContainer>
        {figuresSettingsList.map((settingItem) => (
          <SettingLink link={settingItem.link} title={settingItem.title} key={settingItem.id} />
        ))}
      </FigureListContainer>
    </SettingsWrapper>
  )
}

export default FigureList
