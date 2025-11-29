import { ToastContainer } from 'react-toastify'
import AppRouters from './routers'

const App = () => {
  return (
    <div className="main-app">
      <ToastContainer />
      <AppRouters />
    </div>
  )
}

export default App
