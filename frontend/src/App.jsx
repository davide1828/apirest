import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import GenerosPage from './pages/GenerosPage';
import DirectoresPage from './pages/DirectoresPage';
import ProductorasPage from './pages/ProductorasPage';
import TiposPage from './pages/TiposPage';
import MediaPage from './pages/MediaPage';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">Admin - Alquiler Películas</NavLink>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/generos">Géneros</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/directores">Directores</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productoras">Productoras</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/tipos">Tipos</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/media">Catálogo Media</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<h2>Bienvenido al Panel de Administración</h2>} />
          <Route path="/generos" element={<GenerosPage />} />
          <Route path="/directores" element={<DirectoresPage />} />
          <Route path="/productoras" element={<ProductorasPage />} />
          <Route path="/tipos" element={<TiposPage />} />
          <Route path="/media" element={<MediaPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
