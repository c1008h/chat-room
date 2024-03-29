import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/authSlices'
import participantReducer from './participants/participantSlices'
import sessionReducer from './session/sessionSlices'
import friendReducer from './friends/friendSlices'
import anonReducer from './anon/anonSlices'

const store = configureStore({
    reducer: {
        auth: authReducer,
        participant: participantReducer,
        session: sessionReducer,
        friend: friendReducer,
        anon: anonReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;