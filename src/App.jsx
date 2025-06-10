import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { routes } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col overflow-hidden bg-surface-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {routes.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="rounded-lg shadow-lg"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;