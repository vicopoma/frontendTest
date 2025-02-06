import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import { createRootReducer, history } from './reducers';
import { logger, storageFilterMiddleware } from './middlewares/middlewares';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState?: any) {
  const store = createStore(
    createRootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        logger,
        storageFilterMiddleware,
        thunk
      ),
    )
  );
  return store;
}
