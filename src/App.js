import React, { useState } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from '@aws-amplify/ui-react'
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components'
import 'bootstrap/dist/css/bootstrap.css'
import 'assets/scss/paper-dashboard.scss?v=1.2.0'
import 'assets/demo/demo.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import AdminLayout from 'layouts/Admin.js'
const hist = createBrowserHistory()

function App() {
 
  const [authState, setAuthState] = useState()
  const [user, setUser] = useState()

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState)
      setUser(authData)
    })
  }, [])

  return authState === AuthState.SignedIn && user ? (
    <Router history={hist}>
      <Switch>
        <Route path='/admin' render={(props) => <AdminLayout {...props} />} />
        <Redirect to='/admin/dashboard' />
      </Switch>
    </Router>
  ) : (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <AmplifyAuthenticator />
      
    </div>
  )
}

export default App

