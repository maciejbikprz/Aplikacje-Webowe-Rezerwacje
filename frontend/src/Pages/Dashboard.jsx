import { useState, useEffect } from 'react'
import { reservationsAPI } from '../services/api'

export default function Dashboard() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      const data = await reservationsAPI.getByUser(userId)
      setReservations(data)
      setError('')
    } catch (err) {
      setError(err.message)
      setReservations([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return

    try {
      await reservationsAPI.delete(reservationId)
      setReservations(prev => prev.filter(r => r.id !== reservationId))
    } catch (err) {
      alert(err.message)
    }
  }

  const getReservationStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return 'Upcoming'
    if (now > end) return 'Completed'
    return 'Active'
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Moje rezerwacje</h1>

        {loading && <div className="loading">Ładowanie rezerwacji...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && reservations.length === 0 && (
          <div className="no-reservations">
            <p>Nie masz żadnych rezerwacji.</p>
            <a href="/boats" className="browse-link">Przeglądaj dostępne łodzie</a>
          </div>
        )}

        {!loading && reservations.length > 0 && (
          <div className="reservations-list">
            {reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <h3>{reservation.boat?.name || 'Boat'}</h3>
                  <span className={`status ${getReservationStatus(reservation.startDate, reservation.endDate).toLowerCase()}`}>
                    {getReservationStatus(reservation.startDate, reservation.endDate)}
                  </span>
                </div>

                <div className="reservation-details">
                  <div className="detail-item">
                    <strong>Check-in:</strong>
                    <span>{new Date(reservation.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Check-out:</strong>
                    <span>{new Date(reservation.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Duration:</strong>
                    <span>
                      {Math.ceil((new Date(reservation.endDate) - new Date(reservation.startDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Total Price:</strong>
                    <span className="price">${reservation.totalPrice}</span>
                  </div>
                </div>

                {getReservationStatus(reservation.startDate, reservation.endDate) === 'Upcoming' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancel(reservation.id)}
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}