import { useEffect, useState } from 'react';
import api from '../utils/api';

function ProductorasPage() {
  const [productoras, setProductoras] = useState([]);
  const [form, setForm] = useState({ nombre: '', slogan: '', descripcion: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProductoras = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/productora');
      setProductoras(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productoras');
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
        await api.put(`/productora/${editId}`, form);
        setSuccess('Productora actualizada correctamente');
        setEditId(null);
      } else {
        await api.post('/productora', form);
        setSuccess('Productora creada correctamente');
      }
      setForm({ nombre: '', slogan: '', descripcion: '' });
      fetchProductoras();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error en la operación');
    }
  };

  const handleEdit = (productora) => {
    setForm({ nombre: productora.nombre, slogan: productora.slogan || '', descripcion: productora.descripcion || '' });
    setEditId(productora._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta productora?')) return;
    try {
      await api.delete(`/productora/${id}`);
      setSuccess('Productora eliminada correctamente');
      fetchProductoras();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ nombre: '', slogan: '', descripcion: '' });
    setError('');
  };

  useEffect(() => {
    fetchProductoras();
  }, []);

  return (
    <div>
      <h2>Gestión de Productoras</h2>
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}</div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}</div>}

      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Productora' : 'Nueva Productora'}</h5>
              <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre comercial" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Eslogan</label>
                  <input className="form-control" name="slogan" value={form.slogan} onChange={handleChange} placeholder="Frase identificativa" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} rows={2} placeholder="Opcional" />
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
              <h5 className="card-title text-white mb-4">Lista de Productoras</h5>
              {loading ? (
                <div>Cargando...</div>
              ) : productoras.length ? (
                <div className="table-responsive">
                  <table className="table text-light border-0" style={{ backgroundColor: 'transparent' }}>
                    <thead style={{ background: 'rgba(31, 47, 89, 0.8)' }}>
                      <tr>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Nombre</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Slogan</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Activo</th>
                        <th className="border-bottom-0" style={{ color: '#10b981' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productoras.map((p) => (
                        <tr key={p._id} style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}>
                          <td className="bg-transparent text-light border-0">{p.nombre}</td>
                          <td className="bg-transparent text-light border-0">{p.slogan || '-'}</td>
                          <td className="bg-transparent text-light border-0">{p.isActive ? 'Sí' : 'No'}</td>
                          <td className="bg-transparent border-0">
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-info" style={{ background: 'rgba(147, 51, 234, 0.8)', borderColor: 'rgba(147, 51, 234, 1)', color: '#fff' }} onClick={() => handleEdit(p)}>
                                Editar
                              </button>
                              <button className="btn btn-sm btn-danger" style={{ background: 'rgba(192, 57, 43, 0.8)', borderColor: 'rgba(149, 43, 33, 1)', color: '#fff' }} onClick={() => handleDelete(p._id)}>
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
                <div className="text-light">No hay productoras cargadas.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductorasPage;
