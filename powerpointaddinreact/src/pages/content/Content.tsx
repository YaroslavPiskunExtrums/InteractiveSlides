import { useHashRouting } from '@lib/hooks/useHashRouting'
import { contentRouter } from '@lib/routes/appRouter'

const Content = () => {
  const { hash } = useHashRouting()

  return contentRouter[hash]
}
export default Content
