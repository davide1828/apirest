import { useEffect, useState } from 'react';
import api from '../utils/api';

function TiposPage() {
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tipo');
      setTipos(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar tipos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      if (editId) {
        await api.put(`/tipo/${editId}`, form);
        setSuccess('Tipo actualizado correctamente');
        setEditId(null);
      } else {
        await api.post('/tipo', form);
        setSuccess('Tipo creado correctamente');
      }
      setForm({ nombre: '', descripcion: '' });
      fetchTipos();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error en la operación');
    }
  };

  const handleEdit = (tipo) => {
    setForm({ nombre: tipo.nombre, descripcion: tipo.descripcion || '' });
    setEditId(tipo._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este tipo?')) return;
    try {
      await api.delete(`/tipo/${id}`);
      setSuccess('Tipo eliminado correctamente');
      fetchTipos();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nombre: '', descripcion: '' });
    setError('');
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  return (
    <div>
      <h2>Gestión de Tipos</h2>
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Tipo' : 'Nuevo Tipo'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Película, Serie, Documental" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Información adicional" />
                </div>
                <button type="submit" className="btn btn-primary">
                  {editId ? 'Actualizar' : 'Crear'}
                </button>
                {editId && (
                  <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          {loading ? (
            <div>Cargando...</div>
          ) : tipos.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tipos.map((t) => (
                    <tr key={t._id}>
                      <td>{t.nombre}</td>
                      <td>{t.descripcion || '-'}</td>
                      <td>{new Date(t.fechaCreacion).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-info" onClick={() => handleEdit(t)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(t._id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay tipos cargados.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TiposPage;
