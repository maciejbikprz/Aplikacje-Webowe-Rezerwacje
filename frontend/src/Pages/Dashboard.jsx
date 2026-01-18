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

  // --- FUNKCJE POMOCNICZE UI ---

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

  const calculateDuration = (start, end) => {
    const diff = new Date(end) - new Date(start)
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getStatusConfig = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return { label: 'Nadchodząca', className: 'upcoming' }
    if (now > end) return { label: 'Zakończona', className: 'completed' }
    return { label: 'W trakcie', className: 'active' }
  }

  return (
    <div className="boats-page-container">
      <div className="section-title-bar">
        <h2>Moje rezerwacje</h2>
      </div>

      {loading && <div className="loading">Ładowanie rezerwacji...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && reservations.length === 0 && (
        <div className="no-reservations">
          <p>Nie masz żadnych rezerwacji.</p>
          <a href="/boats" className="browse-link">Przeglądaj dostępne łodzie</a>
        </div>
      )}

      {!loading && reservations.length > 0 && (
        <div className="boats-list">
          {reservations.map(reservation => {
            const status = getStatusConfig(reservation.startDate, reservation.endDate)
            const duration = calculateDuration(reservation.startDate, reservation.endDate)

            return (
              <div key={reservation.id} className="reservation-card-container">
                
                {/* LEWA STRONA: Nazwa i Status */}
                <div className="res-card-left">
                  <h3>{reservation.boat?.name || 'Boat'}</h3>
                  <div className={`status-badge ${status.className}`}>
                    {status.label}
                  </div>
                </div>

                {/* PRAWA STRONA: Daty, Cena, Czas, Przyciski */}
                <div className="res-card-right">
                  
                  <div className="res-date-section">
                    <span className="res-date-label">Data rezerwacji:</span>
                    <div className="res-date-box">
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                    </div>
                    
                    {/* Cena i Czas */}
                    <div className="res-stats-row">
                      <span>⏳ {duration} dni</span>
                      <span>💰 ${reservation.totalPrice}</span>
                    </div>
                  </div>

                  <button className="res-details-btn">
                    Szczegóły łodzi
                  </button>

                  {/* Przycisk anulowania widoczny tylko dla nadchodzących (lub zawsze - wg uznania) */}
                  {status.className === 'upcoming' && (
                    <button 
                      className="res-cancel-strip"
                      onClick={() => handleCancel(reservation.id)}
                    >
                      Anuluj rezerwacje
                    </button>
                  )}
                  {status.className !== 'upcoming' && (
                     <div className="res-cancel-strip disabled">Rezerwacja zakończona</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}