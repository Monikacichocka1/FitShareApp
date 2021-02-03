import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import FullScreenCircuralProgress from './components/FullScreenCircuralProgress'
import Snackbars from './components/Snackbars'
import ScrollToTop from './components/ScrollToTop'
import AppBar from './components/AppBar'
import Drawer from './components/Drawer'
import Dashboard from './views/Dashboard'
import AddFitList from './views/AddFitList'
import FitLists from './views/FitLists'
import UserFitList from './views/UserFitList'
import ChangePassword from './views/ChangePassword'
import Auth from './Auth'

const App = props => {
  return (
    <div>
      <Auth>
        <BrowserRouter>
          <AppBar />
          <Drawer />
          <Route path='/' exact component={Dashboard} />
          <Route path='/add-fitlist' component={AddFitList} />
          <Route path='/fitlists' component={FitLists} />
          <Route path='/your-fitlist/:id?' component={UserFitList} />
          <Route path='/change-password' component={ChangePassword} />
        </BrowserRouter>
      </Auth>

      <FullScreenCircuralProgress />
      <Snackbars />
      <ScrollToTop />
    </div>
  )
}

export default App