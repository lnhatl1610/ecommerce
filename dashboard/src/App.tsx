import { createBrowserRouter, RouterProvider } from 'react-router'
import routes from './routes';
import { ToastViewport } from './components/ToastViewport';

const router = createBrowserRouter(routes);

function App() {
  return (
    <><RouterProvider router={router} /><ToastViewport /></>
  )
}

export default App
