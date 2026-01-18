import { useNavigate } from 'react-router-dom'

export default function BoatCard({ boat, isAuthenticated }) {
  const navigate = useNavigate()

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    alert(`Próba rezerwacji łodzi: ${boat.name}`)
  }

  const isAvailable = boat.status === 'available';

  return (
    <div className="boat-card">
      {/* Sekcja Obrazka */}
      <div className="boat-image">
        
        <span className={`status-badge ${boat.status}`}>
          {isAvailable ? '✓ Available' : 'Reserved'}
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
          className={`reserve-btn ${isAvailable ? '' : 'disabled'}`}
          onClick={handleReserve}
          disabled={!isAvailable} 
        >
          {isAvailable ? 'Reserve Now' : 'Not Available'}
        </button>
      </div>
    </div>
  )
}