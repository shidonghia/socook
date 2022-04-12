import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles'
import Auth from './components/Authentication';
import PublicRoute from './features/PublicRoute';
import PrivateRoute from './features/PrivateRoute';
import RegisterForm from './components/Authentication/RegisterForm';
import ActiveEmail from './components/Authentication/ActiveEmail';
import LoginForm from './components/Authentication/LoginForm';
import Verify from './components/Authentication/Verify';
import Header from './components/Header';
import BasePage from './components/BasePage';
import Home from './components/HomePage';

function App() {
  return (
    <GlobalStyles>
        <React.StrictMode>
          <Router>
            <Routes>
              <Route path='' element={ <PrivateRoute />}> 
                {/* <Route index  element={ <Header /> }/> */}
                {/* <Route path='*' element={( <h1> Not Found </h1> )} /> */}
                {/* <Route path='/w-active' element = { <WaitingActiveEmail/>} /> */}
              </Route>
              <Route path='' element={ <PublicRoute />} >
                <Route path='' element={ <Auth /> }>
                  <Route path='/login' element={ <LoginForm />} />
                  <Route path='/register' element={ <RegisterForm /> } />
                  {/* <Route path='/rspassword' element={ <RegisterForm /> } /> */}
                  {/* <Route path='/activeEmail' element={ <ActiveEmail />} /> */}
                  {/* <Route path='*' element={( <h1> Not Found </h1> )} /> */}
                </Route>
              </Route>
              <Route path='' element={<BasePage />}>
                <Route index element={<Home />} />
                <Route path='/activeEmail' element ={ <ActiveEmail/>} />
                <Route path='/verify' element={<Auth />}>
                  <Route path='' element={ < Verify/>} />
                </Route>  
              </Route>
            </Routes>
          </Router>
        </React.StrictMode>
    </GlobalStyles>
  );
}

export default App;
