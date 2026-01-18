import { useState } from 'react'
import { reservationsAPI } from '../services/api'

export default function ReservationModal({ boat, onClose, onSuccess }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!startDate || !endDate) {
      setError('Please select both dates')
      return
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after start date')
      return
    }

    try {
      setLoading(true)
      setError('')
      const userId = localStorage.getItem('userId')

      await reservationsAPI.create({
        boatId: boat.id,
        userId: parseInt(userId),
        startDate,
        endDate
      })

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const days = startDate && endDate 
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0
  const totalPrice = days * boat.pricePerDay

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reserve {boat.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="boat-summary">
            <p><strong>Boat:</strong> {boat.name}</p>
            <p><strong>Price:</strong> ${boat.pricePerDay}/day</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate || today}
              required
            />
          </div>

          {startDate && endDate && days > 0 && (
            <div className="price-calculation">
              <p>Duration: {days} {days === 1 ? 'day' : 'days'}</p>
              <p className="total">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-confirm" disabled={loading}>
              {loading ? 'Creating...' : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

