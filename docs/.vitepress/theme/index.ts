import DefaultTheme from 'vitepress/theme'
import './custom.css'
import StatusBadge from './components/StatusBadge.vue'
import ToolPage from './components/ToolPage.vue'
import ToolList from './components/ToolList.vue'
import BenchmarkList from './components/BenchmarkList.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('StatusBadge', StatusBadge)
    app.component('ToolPage', ToolPage)
    app.component('ToolList', ToolList)
    app.component('BenchmarkList', BenchmarkList)
  }
}
