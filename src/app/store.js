import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../features/boardSlice'
import aliasTemplatesReducer from '../newLIstBoardFeature/aliasTemplatesSlice'

const store = configureStore({
    reducer: {
        boards: boardReducer,
        aliasTemplates: aliasTemplatesReducer
    },
})

export default store
