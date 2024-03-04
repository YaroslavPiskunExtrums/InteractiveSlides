import { useHashRouting } from '@lib/hooks/useHashRouting'
import { taskPaneRouter } from '@lib/routes/appRouter'

const TaskPane = () => {
  const { hash } = useHashRouting()

  return taskPaneRouter[hash]
}

export default TaskPane
