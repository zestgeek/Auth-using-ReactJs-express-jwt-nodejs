import React from 'react';
import { Route } from 'react-router-dom'
import Home from '../home'
import Helloworld from '../helloworld'
import Signup from '../signup'

const App = () => (
  <div>
    <header>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Helloworld} />
      <Route exact path="/signup" component={Signup} />
    </main>
  </div>
)
export default App