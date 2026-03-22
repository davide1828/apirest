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
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editId ? 'Editar Productora' : 'Nueva Productora'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Warner Bros" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Slogan</label>
                  <input className="form-control" name="slogan" value={form.slogan} onChange={handleChange} placeholder="Ej: That's All, Folks!" />
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
          ) : productoras.length ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Slogan</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productoras.map((p) => (
                    <tr key={p._id}>
                      <td>{p.nombre}</td>
                      <td>{p.slogan || '-'}</td>
                      <td>{p.isActive ? 'Sí' : 'No'}</td>
                      <td>
                        <button className="btn btn-sm btn-info" onClick={() => handleEdit(p)}>
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(p._id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay productoras cargadas.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductorasPage;
