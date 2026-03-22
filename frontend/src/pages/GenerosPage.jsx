import { useEffect, useState } from 'react';
import api from '../utils/api';

function GenerosPage() {
  const [generos, setGeneros] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGeneros = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/genero');
      setGeneros(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar géneros.');
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
      setError('El nombre es obligatorio');
      return;
    }

    try {
      setError('');
      setSuccess('');
      if (editId) {
        await api.put(`/genero/${editId}`, form);
        setSuccess('Género actualizado correctamente');
        setEditId(null);
      } else {
        await api.post('/genero', form);
        setSuccess('Género creado correctamente');
      }
      setForm({ nombre: '', descripcion: '' });
      fetchGeneros();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'No se pudo realizar la operación');
    }
  };

  const handleEdit = (genero) => {
    setForm({ nombre: genero.nombre, descripcion: genero.descripcion || '' });
    setEditId(genero._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este género?')) return;
    try {
      await api.delete(`/genero/${id}`);
      setSuccess('Género eliminado correctamente');
      fetchGeneros();
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
    fetchGeneros();
  }, []);

  return (
    <div>
      <h2>Gestión de Géneros</h2>
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Género' : 'Nuevo Género'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Comedia" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Opcional" />
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
            <div>Cargando géneros...</div>
          ) : generos.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {generos.map((g) => (
                    <tr key={g._id}>
                      <td>{g.nombre}</td>
                      <td>{g.descripcion || '-'}</td>
                      <td>{g.isActive ? 'Sí' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-info" onClick={() => handleEdit(g)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(g._id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay géneros cargados.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerosPage;
