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
    if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) return

    try {
      await reservationsAPI.update(reservationId, { status: 'cancelled' })

      setReservations(prev => prev.map(r => 
        r.id === reservationId ? { ...r, status: 'cancelled' } : r
      ))
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

  // ZMIANA KLUCZOWA: Obsługa statusów pending/confirmed
  const getStatusConfig = (reservation) => {
    // 1. Jeśli anulowana w bazie
    if (reservation.status === 'cancelled') {
        return { label: 'Anulowana', className: 'cancelled' }
    }

    // 2. Sprawdzamy datę (czy zakończona)
    const now = new Date()
    const end = new Date(reservation.endDate)
    if (now > end) {
        return { label: 'Zakończona', className: 'completed' }
    }

    // 3. Statusy aktywne z bazy (pending / confirmed)
    if (reservation.status === 'pending') {
        return { label: 'Oczekująca', className: 'pending' } // Np. kolor żółty/pomarańczowy w CSS
    }
    
    if (reservation.status === 'confirmed') {
        return { label: 'Potwierdzona', className: 'confirmed' } // Np. kolor zielony w CSS
    }

    // Fallback
    return { label: 'Inny', className: 'unknown' }
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
            const status = getStatusConfig(reservation)
            const duration = calculateDuration(reservation.startDate, reservation.endDate)

            // Sprawdzamy czy można anulować (tylko pending lub confirmed)
            const canCancel = status.className === 'pending' || status.className === 'confirmed';

            return (
              <div key={reservation.id} className={`reservation-card-container ${reservation.status === 'cancelled' ? 'is-cancelled' : ''}`}>
                
                <div className="res-card-left">
                  <h3>{reservation.boat?.name || 'Boat'}</h3>
                  {/* Klasa CSS będzie teraz: status-badge pending LUB status-badge confirmed */}
                  <div className={`status-badge ${status.className}`}>
                    {status.label}
                  </div>
                </div>

                <div className="res-card-right">
                  <div className="res-date-section">
                    <span className="res-date-label">Data rezerwacji:</span>
                    <div className="res-date-box">
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                    </div>
                    
                    <div className="res-stats-row">
                      <span>⏳ {duration} dni</span>
                      <span>💰 ${reservation.totalPrice}</span>
                    </div>
                  </div>

                  <button className="res-details-btn">
                    Szczegóły łodzi
                  </button>

                  {/* ZMIANA: Przycisk anulowania dostępny dla pending i confirmed */}
                  {canCancel && (
                    <button 
                      className="res-cancel-strip"
                      onClick={() => handleCancel(reservation.id)}
                    >
                      Anuluj rezerwacje
                    </button>
                  )}
                  
                  {/* Informacja dla anulowanych */}
                  {status.className === 'cancelled' && (
                      <div className="res-cancel-strip disabled">Rezerwacja anulowana</div>
                  )}

                  {status.className === 'completed' && (
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