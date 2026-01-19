import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css" // Style kalendarza
import { eachDayOfInterval } from 'date-fns'
import { reservationsAPI } from '../services/api'

export default function ReservationModal({ boat, onClose, onSuccess }) {
  // Zmieniamy stan początkowy na null (dla DatePickera)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  
  // Nowy stan na zajęte daty
  const [excludeDates, setExcludeDates] = useState([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. POBIERANIE ZAJĘTYCH TERMINÓW PRZY STARCIE
  useEffect(() => {
    const fetchOccupiedDates = async () => {
      try {
        // Pobieramy wszystkie rezerwacje
        // (W idealnym świecie API powinno mieć endpoint: /boats/:id/reservations)
        const allReservations = await reservationsAPI.getAll()
        
        // Filtrujemy rezerwacje TEJ KONKRETNEJ łodzi, które nie są anulowane
        const boatReservations = allReservations.filter(
          res => res.boatId === boat.id && res.status !== 'cancelled'
        )

        let disabledDays = []
        
        // Przeliczamy zakresy (np. 1-5 lipca) na konkretne dni (1,2,3,4,5)
        boatReservations.forEach(res => {
          try {
            const interval = eachDayOfInterval({
              start: new Date(res.startDate),
              end: new Date(res.endDate)
            })
            disabledDays = [...disabledDays, ...interval]
          } catch (e) {
            console.error("Błąd daty w bazie:", e)
          }
        })

        setExcludeDates(disabledDays)
      } catch (err) {
        console.error("Błąd pobierania dostępności:", err)
      }
    }

    fetchOccupiedDates()
  }, [boat.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!startDate || !endDate) {
      setError('Please select both dates')
      return
    }

    if (endDate <= startDate) {
      setError('End date must be after start date')
      return
    }

    try {
      setLoading(true)
      setError('')
      const userId = localStorage.getItem('userId')

      // DatePicker zwraca obiekt Date, musimy go zamienić na string YYYY-MM-DD dla API
      // Dodajemy 12h, aby uniknąć problemów ze strefami czasowymi przy konwersji
      const isoStart = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const isoEnd = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      await reservationsAPI.create({
        boatId: boat.id,
        userId: parseInt(userId),
        startDate: isoStart,
        endDate: isoEnd
      })

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Obliczanie ceny i dni
  const days = startDate && endDate 
    ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    : 0
  const totalPrice = days * boat.pricePerDay

  return (
    <div className="modal-overlay">
      {/* stopPropagation zapobiega zamykaniu przy kliknięciu w środek */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Reserve {boat.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="boat-summary">
            <p><strong>Boat:</strong> {boat.name}</p>
            <p><strong>Price:</strong> ${boat.pricePerDay}/day</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Formularz bez onSubmit w tagu <form>, obsłużymy przyciskiem */}
          <div className="reservation-form">
            
            <div className="date-inputs-row">
              <div className="form-group">
                <label>Start Date *</label>
                {/* ZAMIANA INPUTA NA DATEPICKER */}
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()} // Nie można wstecz
                  excludeDates={excludeDates} // BLOKOWANIE DAT
                  placeholderText="Select start"
                  className="custom-datepicker"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date *</label>
                {/* ZAMIANA INPUTA NA DATEPICKER */}
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  excludeDates={excludeDates} // BLOKOWANIE DAT
                  placeholderText="Select end"
                  className="custom-datepicker"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
            </div>

            {startDate && endDate && days > 0 && (
              <div className="price-calculation">
                <p>Duration: {days} {days === 1 ? 'day' : 'days'}</p>
                <p className="total">
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>
            )}

            <div className="modal-footer">
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn-confirm" 
                onClick={handleSubmit}
                disabled={loading || !startDate || !endDate}
              >
                {loading ? 'Creating...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}