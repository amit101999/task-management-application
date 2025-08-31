import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice.ts"
import  projectSlice  from "./projectSlice.ts"
import  taskSlice  from "./taskSlice.ts"
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const persistConfig = {
    key:'root',
    storage : storage
}

const rootReducer = combineReducers({
      user : userSlice , 
        projects : projectSlice,
        tasks : taskSlice
})

const persistantReducer = persistReducer(persistConfig , rootReducer)

export const store = configureStore({
    reducer : persistantReducer , 
})

export const persistor = persistStore(store);


// export const store = configureStore({
//     reducer: {
//         user : userSlice , 
//         projects : projectSlice,
//         tasks : taskSlice
//     },
// })

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch