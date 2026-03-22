import { useEffect, useState } from 'react';
import api from '../utils/api';

function DirectoresPage() {
  const [directores, setDirectores] = useState([]);
  const [form, setForm] = useState({ nombre: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDirectores = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/director');
      setDirectores(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar directores');
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
    if (!form.nombre.trim()) {
      setError('Nombre es obligatorio');
      return;
    }

    try {
      setError('');
      setSuccess('');
      if (editId) {
        await api.put(`/director/${editId}`, form);
        setSuccess('Director actualizado correctamente');
        setEditId(null);
      } else {
        await api.post('/director', { nombre: form.nombre.trim() });
        setSuccess('Director creado correctamente');
      }
      setForm({ nombre: '' });
      fetchDirectores();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'No se pudo realizar la operación');
    }
  };

  const handleEdit = (director) => {
    setForm({ nombre: director.nombre });
    setEditId(director._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este director?')) return;
    try {
      await api.delete(`/director/${id}`);
      setSuccess('Director eliminado correctamente');
      fetchDirectores();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nombre: '' });
    setError('');
  };

  useEffect(() => {
    fetchDirectores();
  }, []);

  return (
    <div>
      <h2>Gestión de Directores</h2>
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Director' : 'Nuevo Director'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Steven Spielberg" required />
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
          ) : directores.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Activo</th>
                    <th>Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {directores.map((d) => (
                    <tr key={d._id}>
                      <td>{d.nombre}</td>
                      <td>{d.isActive ? 'Sí' : 'No'}</td>
                      <td>{new Date(d.fechaCreacion).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-info" onClick={() => handleEdit(d)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(d._id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay directores cargados.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DirectoresPage;
