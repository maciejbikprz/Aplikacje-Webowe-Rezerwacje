import { useState, useEffect } from 'react'
import BoatCard from '../Components/BoatCard'
import { boatsAPI } from '../services/api'

export default function Boats({ isAuthenticated }) {
  const [boats, setBoats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBoats()
  }, [filter])

  const fetchBoats = async () => {
    try {
      setLoading(true)
      const data = await boatsAPI.getAll(filter)
      setBoats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setBoats([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to sailReservations</h1>
          <p>Discover and book the perfect sailing boat for your adventure</p>
        </div>
      </section>

      <section className="boats-section">
        <div className="section-header">
          <h2>Available Boats</h2>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Boats
            </button>
            <button 
              className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
              onClick={() => setFilter('available')}
            >
              Available
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading boats...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && boats.length === 0 && (
          <div className="no-boats">No boats available at the moment.</div>
        )}

        {!loading && boats.length > 0 && (
          <div className="boats-grid">
            {boats.map(boat => (
              <BoatCard 
                key={boat.id} 
                boat={boat} 
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}