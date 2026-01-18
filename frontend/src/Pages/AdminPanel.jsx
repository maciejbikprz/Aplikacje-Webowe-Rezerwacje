import { useState, useEffect } from 'react'
import { boatsAPI } from '../services/api'

export default function AdminPanel() {
  const [boats, setBoats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBoatForm, setShowBoatForm] = useState(false)
  const [editingBoat, setEditingBoat] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    capacity: '',
    pricePerDay: '',
    length: '',
    status: 'available'
  })

  // Pobieramy łodzie tylko raz przy załadowaniu komponentu
  useEffect(() => {
    fetchBoats()
  }, [])

  const fetchBoats = async () => {
    try {
      setLoading(true)
      const data = await boatsAPI.getAll()
      setBoats(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitBoat = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const boatData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        pricePerDay: parseFloat(formData.pricePerDay),
        length: formData.length ? parseFloat(formData.length) : null
      }

      if (editingBoat) {
        await boatsAPI.update(editingBoat.id, boatData)
      } else {
        await boatsAPI.create(boatData)
      }

      await fetchBoats()
      setShowBoatForm(false)
      setEditingBoat(null)
      setFormData({
        name: '',
        type: '',
        description: '',
        capacity: '',
        pricePerDay: '',
        length: '',
        status: 'available'
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBoat = (boat) => {
    setFormData({
      name: boat.name,
      type: boat.type,
      description: boat.description,
      capacity: boat.capacity,
      pricePerDay: boat.pricePerDay,
      length: boat.length || '',
      status: boat.status
    })
    setEditingBoat(boat)
    setShowBoatForm(true)
  }

  const handleDeleteBoat = async (boatId) => {
    if (!window.confirm('Are you sure you want to delete this boat?')) return

    try {
      await boatsAPI.delete(boatId)
      await fetchBoats()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddNewBoat = () => {
    setEditingBoat(null)
    setFormData({
      name: '',
      type: '',
      description: '',
      capacity: '',
      pricePerDay: '',
      length: '',
      status: 'available'
    })
    setShowBoatForm(true)
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1>Admin Panel - Boats</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="content-wrapper">
            <div className="section-header">
              <h2>Boats Management</h2>
              <button 
                className="btn-add"
                onClick={handleAddNewBoat}
              >
                + Add New Boat
              </button>
            </div>

            {showBoatForm && (
              <div className="boat-form-container">
                <h3>{editingBoat ? 'Edit Boat' : 'Add New Boat'}</h3>
                <form onSubmit={handleSubmitBoat} className="boat-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Boat Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Type *</label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        placeholder="e.g., Sailboat, Yacht"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Capacity (people) *</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Price per Day ($) *</label>
                      <input
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Length (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="length"
                        value={formData.length}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleFormChange}>
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Boat'}
                    </button>
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => setShowBoatForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading && <div className="loading">Loading boats...</div>}

            {!loading && boats.length === 0 && !showBoatForm && (
              <div className="no-data">No boats found</div>
            )}

            {!loading && boats.length > 0 && (
              <div className="boats-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Capacity</th>
                      <th>Price/Day</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boats.map(boat => (
                      <tr key={boat.id}>
                        <td><strong>{boat.name}</strong></td>
                        <td>{boat.type}</td>
                        <td>{boat.capacity}</td>
                        <td>${boat.pricePerDay}</td>
                        <td><span className={`status-badge ${boat.status}`}>{boat.status}</span></td>
                        <td>
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditBoat(boat)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteBoat(boat.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}