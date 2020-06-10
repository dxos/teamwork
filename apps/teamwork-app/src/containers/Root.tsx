//
// Copyright 2020 DxOS, Inc.
//

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ErrorHandler } from '@dxos/debug';
import {
  SET_LAYOUT,
  AppKitContextProvider,
  CheckForErrors,
  DefaultRouter,
  Registration,
  RequireWallet,
  SystemRoutes,
  Theme
} from '@dxos/react-appkit';
import { ClientContextProvider } from '@dxos/react-client';

import App from './App';
import { Landing } from './Landing';

const initialState = {
  [SET_LAYOUT]: {
    showSidebar: true,
    showDebug: false
  }
};

export interface RootProps {
  config: any
}

export const Root = ({ config }: RootProps) => {
  const router = { ...DefaultRouter, publicUrl: config.app.publicUrl };
  const { paths, routes } = router;

  return (
    <Theme>
      <ClientContextProvider config={config}>
        <AppKitContextProvider
          initialState={initialState}
          errorHandler={new ErrorHandler()}
          router={router}
        >
          <CheckForErrors>
            <HashRouter>
              <Switch>
                <Route exact path={routes.register} component={Registration} />
                <RequireWallet redirect={routes.register}>
                  <Switch>
                    {SystemRoutes(router)}
                    <Route exact path={routes.app} component={App} />
                    <Route exact path="/landing" component={Landing} />
                    <Redirect to="/landing" />
                  </Switch>
                </RequireWallet>
              </Switch>
            </HashRouter>
          </CheckForErrors>
        </AppKitContextProvider>
      </ClientContextProvider>
    </Theme>
  );
};
