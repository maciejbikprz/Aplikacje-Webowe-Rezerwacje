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
      <div className="boat-card">
        <div className="boat-image">
          {boat.image && <img src={boat.image} alt={boat.name} />}
          {!boat.image && <div className="no-image">⛵</div>}
          <span className={`status-badge ${boat.status}`}>
            {boat.status === 'available' ? '✓ Available' : 'Reserved'}
          </span>
        </div>
        <div className="boat-details">
          <h3>{boat.name}</h3>
          <p className="boat-type">{boat.type}</p>
          <div className="boat-info">
            <span><strong>Capacity:</strong> {boat.capacity} people</span>
            <span><strong>Price:</strong> ${boat.pricePerDay}/day</span>
            {boat.length && <span><strong>Length:</strong> {boat.length}m</span>}
          </div>
          <p className="boat-description">{boat.description}</p>
          <button 
            className={`reserve-btn ${boat.status === 'available' ? '' : 'disabled'}`}
            onClick={handleReserve}
            disabled={boat.status !== 'available' && isAuthenticated}
          >
            {boat.status === 'available' ? 'Reserve Now' : 'Not Available'}
          </button>
        </div>
      </div>
      {showModal && (
        <ReservationModal 
          boat={boat} 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
          }}
        />
      )}
    </>
  )
}

