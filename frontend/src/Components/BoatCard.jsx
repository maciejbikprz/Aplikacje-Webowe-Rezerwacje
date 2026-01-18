import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReservationModal from './ReservationModal'

export default function BoatCard({ boat, isAuthenticated }) {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowModal(true)
  }

  return (
    <>
      <div className="boat-card-container">
        {/* Lewa sekcja - Nazwa */}
        <div className="card-left">
          <h3>{boat.name}</h3>
          <p className="boat-type-small">{boat.type}</p>
        </div>

        {/* Prawa sekcja - Akcje */}
        <div className="card-right">
          <div className="card-main-action">
            <button 
              className="reserve-btn"
              onClick={handleReserve}
            >
              Zarezerwuj
            </button>
          </div>
          <div className="card-details-strip">
            Szczegóły
          </div>
        </div>
      </div>

      {showModal && (
        <ReservationModal 
          boat={boat} 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            navigate('/dashboard')
          }}
        />
      )}
    </>
  )
}