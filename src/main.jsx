import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import DragAndDrop from './DragAndDrop.jsx'
import Dashboard from './dashboards/Dashboard'
import Dashboard1 from './dashboards/Dashboard1'
import store from './app/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DragAndDrop />} />
        <Route path="/d" element={<Dashboard />} />
        <Route path="/d1" element={<Dashboard1 />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
