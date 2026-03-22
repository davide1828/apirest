import { useEffect, useState } from 'react';
import api from '../utils/api';

function MediaPage() {
  const [medias, setMedias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [form, setForm] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    urlPelicula: '',
    imagen: '',
    anioEstreno: '',
    genero: '',
    director: '',
    productora: '',
    tipo: '',
  });
  const [editId, setEditId] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    director: '',
    productora: '',
    tipo: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const perPageOptions = [4, 8, 12, 16];

  const [showFavorites, setShowFavorites] = useState(false);
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('mediaWatchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [mediasRes, generosRes, directoresRes, productorasRes, tiposRes] = await Promise.all([
        api.get('/media'),
        api.get('/genero'),
        api.get('/director'),
        api.get('/productora'),
        api.get('/tipo'),
      ]);
      setMedias(mediasRes.data);
      setGeneros(generosRes.data);
      setDirectores(directoresRes.data);
      setProductoras(productorasRes.data);
      setTipos(tiposRes.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((old) => ({ ...old, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((old) => ({ ...old, [name]: value }));
  };

  const submitMedia = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // En creación (editId es null), el serial es opcional; en edición es requerido
    if (!form.titulo || !form.urlPelicula || !form.anioEstreno || !form.genero || !form.director || !form.productora || !form.tipo) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        ...form,
        anioEstreno: Number(form.anioEstreno),
      };

      if (editId) {
        await api.put(`/media/${editId}`, payload);
        setSuccess('Media actualizada correctamente');
        setEditId(null);
      } else {
        // En creación, no incluir serial (se genera automáticamente en el backend)
        const { serial, ...createPayload } = payload;
        const response = await api.post('/media', createPayload);
        setSuccess(`Media creada correctamente. Serial: ${response.data.serial}`);
      }

      setForm({
        serial: '',
        titulo: '',
        sinopsis: '',
        urlPelicula: '',
        imagen: '',
        anioEstreno: '',
        genero: '',
        director: '',
        productora: '',
        tipo: '',
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al crear/actualizar media');
    }
  };

  const deleteMedia = async (id) => {
    if (!window.confirm('¿Eliminar esta media?')) return;
    try {
      await api.delete(`/media/${id}`);
      setSuccess('Media eliminada correctamente');
      fetchAllData();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar media');
    }
  };

  const startEditMedia = (media) => {
    setEditId(media._id);
    setForm({
      serial: media.serial || '',
      titulo: media.titulo || '',
      sinopsis: media.sinopsis || '',
      urlPelicula: media.urlPelicula || '',
      imagen: media.imagen || '',
      anioEstreno: media.anioEstreno || '',
      genero: media.genero?._id || '',
      director: media.director?._id || '',
      productora: media.productora?._id || '',
      tipo: media.tipo?._id || '',
    });
    setError('');
    setSuccess('Edita y guarda los cambios');
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      serial: '',
      titulo: '',
      sinopsis: '',
      urlPelicula: '',
      imagen: '',
      anioEstreno: '',
      genero: '',
      director: '',
      productora: '',
      tipo: '',
    });
    setError('');
    setSuccess('');
  };

  const toggleWatchlist = (id) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearWatchlist = () => {
    if (window.confirm('¿Borrar la watchlist local?')) {
      setWatchlist([]);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    localStorage.setItem('mediaWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.genre, filters.director, filters.productora, filters.tipo, showFavorites, medias.length, perPage]);

  const placeholderImage = 'https://images.unsplash.com/photo-1603111882410-dc5ff725d9cc?auto=format&fit=crop&w=800&q=80';

  const filteredMedias = medias
    .filter((m) => m.titulo.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((m) => (filters.genre ? (m.genero?._id === filters.genre) : true))
    .filter((m) => (filters.director ? (m.director?._id === filters.director) : true))
    .filter((m) => (filters.productora ? (m.productora?._id === filters.productora) : true))
    .filter((m) => (filters.tipo ? (m.tipo?._id === filters.tipo) : true))
    .filter((m) => (!showFavorites || watchlist.includes(m._id)));

  const totalPages = Math.max(1, Math.ceil(filteredMedias.length / perPage));
  const currentMedias = filteredMedias.slice((currentPage - 1) * perPage, currentPage * perPage);

  const pageButtons = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const buttons = [1];
    const before = Math.max(2, currentPage - 1);
    const after = Math.min(totalPages - 1, currentPage + 1);

    if (before > 2) {
      buttons.push('...');
    }

    for (let page = before; page <= after; page += 1) {
      buttons.push(page);
    }

    if (after < totalPages - 1) {
      buttons.push('...');
    }

    buttons.push(totalPages);
    return buttons;
  })();

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="media-page">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
        <div>
          <h2>Catálogo Media</h2>
          <p className="text-secondary m-0">{filteredMedias.length} de {medias.length} items</p>
        </div>
        <div className="d-flex gap-2 w-100 w-md-auto align-items-center">
          <input
            className="form-control form-control-sm"
            placeholder="Buscar por título..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select className="form-select form-select-sm" name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">Todos los géneros</option>
            {generos.map((g) => (
              <option key={g._id} value={g._id}>{g.nombre}</option>
            ))}
          </select>
          <select className="form-select form-select-sm" name="director" value={filters.director} onChange={handleFilterChange}>
            <option value="">Todos los directores</option>
            {directores.map((d) => (
              <option key={d._id} value={d._id}>{d.nombre}</option>
            ))}
          </select>
          <button
            className={`btn btn-sm ${showFavorites ? 'btn-warning' : 'btn-outline-warning'}`}
            type="button"
            onClick={() => setShowFavorites((prev) => !prev)}
          >
            {showFavorites ? 'Ver todo' : `Favoritos (${watchlist.length})`}
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            type="button"
            onClick={clearWatchlist}
          >
            Borrar Watchlist
          </button>
          <div className="d-flex align-items-center">
            <label htmlFor="perPage" className="form-label text-secondary mb-0 me-2 small">
              Items por página:
            </label>
            <select
              id="perPage"
              className="form-select form-select-sm"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              {perPageOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-lg-3">
          <select className="form-select form-select-sm" name="productora" value={filters.productora} onChange={handleFilterChange}>
            <option value="">Todas las productoras</option>
            {productoras.map((p) => (
              <option key={p._id} value={p._id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-6 col-lg-3">
          <select className="form-select form-select-sm" name="tipo" value={filters.tipo} onChange={handleFilterChange}>
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t._id} value={t._id}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
        {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm media-panel">
            <div className="card-body">
              <h5 className="card-title mb-3">Nueva Media</h5>
              {loading && <div className="text-muted small">Cargando datos...</div>}
              <form onSubmit={submitMedia}>
                <div className="mb-2">
                  <label className="form-label small">Serial {editId ? '*' : ''}</label>
                  <input 
                    className="form-control form-control-sm" 
                    name="serial" 
                    value={form.serial} 
                    onChange={handleChange} 
                    placeholder={editId ? "Código único" : "Se genera automáticamente"} 
                    disabled={!editId}
                    required={!!editId}
                  />
                  {!editId && <small className="text-muted d-block mt-1">El código se generará automáticamente al guardar</small>}
                </div>
                <div className="mb-2">
                  <label className="form-label small">Título *</label>
                  <input className="form-control form-control-sm" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título de la media" required />
                </div>
                <div className="mb-2">
                  <label className="form-label small">URL Película *</label>
                  <input className="form-control form-control-sm" name="urlPelicula" value={form.urlPelicula} onChange={handleChange} placeholder="URL única" required />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Año de Estreno *</label>
                  <input className="form-control form-control-sm" type="number" name="anioEstreno" value={form.anioEstreno} onChange={handleChange} placeholder="YYYY" required />
                </div>
                <div className="mb-2">
                  <label className="form-label small">Género *</label>
                  <select className="form-select form-select-sm" name="genero" value={form.genero} onChange={handleChange} required>
                    <option value="">-- Selecciona género --</option>
                    {generos.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">Director *</label>
                  <select className="form-select form-select-sm" name="director" value={form.director} onChange={handleChange} required>
                    <option value="">-- Selecciona director --</option>
                    {directores.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">Productora *</label>
                  <select className="form-select form-select-sm" name="productora" value={form.productora} onChange={handleChange} required>
                    <option value="">-- Selecciona productora --</option>
                    {productoras.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">Tipo *</label>
                  <select className="form-select form-select-sm" name="tipo" value={form.tipo} onChange={handleChange} required>
                    <option value="">-- Selecciona tipo --</option>
                    {tipos.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label small">Sinopsis</label>
                  <textarea className="form-control form-control-sm" name="sinopsis" value={form.sinopsis} onChange={handleChange} rows={2} placeholder="Descripción" />
                </div>
                <div className="mb-2">
                  <label className="form-label small">URL Imagen</label>
                  <input className="form-control form-control-sm" name="imagen" value={form.imagen} onChange={handleChange} placeholder="Portada" />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-sm">
                    {editId ? 'Guardar Cambios' : 'Agregar Media'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {loading ? (
            <div className="text-center py-4">Cargando catálogo...</div>
          ) : currentMedias.length ? (
            <>
              <div className="media-grid">
                {currentMedias.map((m) => {
                  const isFav = watchlist.includes(m._id);
                  return (
                    <article className="media-card" key={m._id}>
                      <div
                        className="media-cover"
                        style={{ backgroundImage: `url(${m.imagen || placeholderImage})` }}
                      >
                        <span className="media-tag">{m.tipo?.nombre ?? 'Sin tipo'}</span>
                        <button
                          className={`btn btn-watchlist ${isFav ? 'active' : ''}`}
                          onClick={() => toggleWatchlist(m._id)}
                          type="button"
                          aria-label="Toggle favorito"
                        >
                          {isFav ? '★' : '☆'}
                        </button>
                      </div>
                      <div className="media-body">
                        <h5 className="media-title">{m.titulo}</h5>
                        <p className="media-meta">{m.genero?.nombre ?? 'Género indefinido'} • {m.director?.nombre ?? 'Director indefinido'}</p>
                        <p className="media-sinopsis">{m.sinopsis ? (m.sinopsis.length > 110 ? `${m.sinopsis.slice(0, 110)}...` : m.sinopsis) : 'Sin sinopsis disponible.'}</p>
                        <div className="media-footer">
                          <small className="text-muted">Año {m.anioEstreno || 'N/D'}</small>
                          <div>
                            <button className="btn btn-sm btn-light me-1" onClick={() => startEditMedia(m)}>
                              Editar
                            </button>
                            <a className="btn btn-sm btn-outline-light me-1" href={m.urlPelicula || '#'} target="_blank" rel="noreferrer">
                              Ver
                            </a>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteMedia(m._id)}>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
                <small className="text-muted">Página {currentPage} de {totalPages}</small>
                <div className="d-flex flex-wrap align-items-center gap-1 pagination-controls">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  {pageButtons.map((page, index) =>
                    page === '...' ? (
                      <span key={`dots-${index}`} className="px-2 text-muted">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setCurrentPage(page)}
                        disabled={page === currentPage}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">No hay medias en el catálogo. Agrega tu primera entrada.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaPage;
