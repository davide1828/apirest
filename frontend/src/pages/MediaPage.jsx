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

  const submitMedia = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.serial || !form.titulo || !form.urlPelicula || !form.anioEstreno || !form.genero || !form.director || !form.productora || !form.tipo) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const payload = {
        ...form,
        anioEstreno: Number(form.anioEstreno),
      };
      await api.post('/media', payload);
      setSuccess('Media creada correctamente');
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
      setError(err?.response?.data?.message || 'Error al crear media');
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

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div>
      <h2>Catálogo Media</h2>
      <div className="mb-3">
        {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
        {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}
      </div>

      <div className="row">
        <div className="col-lg-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Nueva Media</h5>
              {loading && <div className="text-muted small">Cargando datos...</div>}
              <form onSubmit={submitMedia}>
                <div className="mb-2">
                  <label className="form-label">Serial *</label>
                  <input className="form-control form-control-sm" name="serial" value={form.serial} onChange={handleChange} placeholder="Código único" required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Título *</label>
                  <input className="form-control form-control-sm" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título de la media" required />
                </div>
                <div className="mb-2">
                  <label className="form-label">URL Película *</label>
                  <input className="form-control form-control-sm" name="urlPelicula" value={form.urlPelicula} onChange={handleChange} placeholder="URL única" required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Año de Estreno *</label>
                  <input className="form-control form-control-sm" type="number" name="anioEstreno" value={form.anioEstreno} onChange={handleChange} placeholder="YYYY" required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Género *</label>
                  <select className="form-control form-control-sm" name="genero" value={form.genero} onChange={handleChange} required>
                    <option value="">-- Selecciona género --</option>
                    {generos.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Director *</label>
                  <select className="form-control form-control-sm" name="director" value={form.director} onChange={handleChange} required>
                    <option value="">-- Selecciona director --</option>
                    {directores.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Productora *</label>
                  <select className="form-control form-control-sm" name="productora" value={form.productora} onChange={handleChange} required>
                    <option value="">-- Selecciona productora --</option>
                    {productoras.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Tipo *</label>
                  <select className="form-control form-control-sm" name="tipo" value={form.tipo} onChange={handleChange} required>
                    <option value="">-- Selecciona tipo --</option>
                    {tipos.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Sinopsis</label>
                  <textarea className="form-control form-control-sm" name="sinopsis" value={form.sinopsis} onChange={handleChange} rows={2} placeholder="Descripción" />
                </div>
                <div className="mb-2">
                  <label className="form-label">URL Imagen</label>
                  <input className="form-control form-control-sm" name="imagen" value={form.imagen} onChange={handleChange} placeholder="Portada" />
                </div>
                <button type="submit" className="btn btn-success btn-sm">
                  Agregar Media
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          {loading ? (
            <div>Cargando...</div>
          ) : medias.length ? (
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Serial</th>
                    <th>Título</th>
                    <th>Género</th>
                    <th>Director</th>
                    <th>Año</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {medias.map((m) => (
                    <tr key={m._id}>
                      <td className="text-truncate" style={{ maxWidth: '80px' }}>
                        {m.serial}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }}>
                        {m.titulo}
                      </td>
                      <td>{m.genero?.nombre ?? 'N/D'}</td>
                      <td>{m.director?.nombre ?? 'N/D'}</td>
                      <td>{m.anioEstreno}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteMedia(m._id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay medias en el catálogo.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaPage;
