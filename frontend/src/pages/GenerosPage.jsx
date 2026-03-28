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
        <div className="col-12 col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Género' : 'Nuevo Género'}</h5>
              <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Comedia" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Opcional" />
                </div>
                <div className="d-grid gap-2 d-md-block">
                  <button type="submit" className="btn btn-primary">
                    {editId ? 'Actualizar' : 'Crear'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-secondary ms-md-2" onClick={handleCancel}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <div className="card mb-4" style={{ background: 'linear-gradient(135deg, rgba(31, 47, 89, 0.7), rgba(19, 28, 54, 0.9))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div className="card-body">
              <h5 className="card-title text-white mb-4">Lista de Géneros</h5>
              {loading ? (
                <div>Cargando géneros...</div>
              ) : generos.length ? (
                <div className="table-responsive">
                  <table className="table text-light border-0" style={{ backgroundColor: 'transparent' }}>
                    <thead style={{ background: 'rgba(31, 47, 89, 0.8)' }}>
                      <tr>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Nombre</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Descripción</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Activo</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generos.map((g) => (
                        <tr key={g._id} style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <td className="bg-transparent text-light border-0">{g.nombre}</td>
                          <td className="bg-transparent text-light border-0">{g.descripcion || '-'}</td>
                          <td className="bg-transparent text-light border-0">{g.isActive ? 'Sí' : 'No'}</td>
                          <td className="bg-transparent border-0">
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-info" style={{ background: 'rgba(147, 51, 234, 0.8)', borderColor: 'rgba(147, 51, 234, 1)', color: '#fff' }} onClick={() => handleEdit(g)}>
                                Editar
                              </button>
                              <button className="btn btn-sm btn-danger" style={{ background: 'rgba(192, 57, 43, 0.8)', borderColor: 'rgba(149, 43, 33, 1)', color: '#fff' }} onClick={() => handleDelete(g._id)}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-light">No hay géneros cargados.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerosPage;
