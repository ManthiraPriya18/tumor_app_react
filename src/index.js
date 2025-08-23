import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './redux/store';
import { Provider } from 'react-redux';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { ProtectedRoute } from './services/Auth/Auth';
import routesConfig from './routesConfig';
import { GetAndSetAppConfig } from './services/config/appConfig.ts';
import { InitializeSupabaseClient } from './supabase/SupabaseClient.ts';

async function InitializeApp(){
  await GetAndSetAppConfig();
  await InitializeSupabaseClient();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <HashRouter>
          <Routes>
            {routesConfig.map((route, index) => {
              const { path, component: Component, protected: isProtected } = route;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    isProtected ? (
                      <ProtectedRoute>
                        <Component />
                      </ProtectedRoute>
                    ) : (
                      <Component />
                    )
                  }
                />
              );
            })}
          </Routes>
        </HashRouter>
  
      </Provider>
    </React.StrictMode>
  );
}

InitializeApp();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
