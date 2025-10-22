import { configureStore } from '@reduxjs/toolkit'
import boardReducer from '../features/boardSlice'
import aliasTemplatesReducer from '../newLIstBoardFeature/aliasTemplatesSlice'
import filterReducer from '@/form-filter/filterSlice'

const store = configureStore({
    reducer: {
        boards: boardReducer,
        aliasTemplates: aliasTemplatesReducer,
        filter: filterReducer,
    },
})

export default store
