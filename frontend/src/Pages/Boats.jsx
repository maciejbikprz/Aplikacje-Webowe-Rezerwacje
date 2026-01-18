import { useState, useEffect } from 'react'
import BoatCard from '../Components/BoatCard'
import { boatsAPI } from '../services/api'

export default function Boats({ isAuthenticated }) {
  const [boats, setBoats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // --- STANY PAGINACJI ---
  const [currentPage, setCurrentPage] = useState(1)
  const boatsPerPage = 5

  useEffect(() => {
    fetchBoats()
  }, [])

  // Resetuj stronę do 1, gdy zmienia się wyszukiwanie lub lista łodzi
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, boats.length])

  const fetchBoats = async () => {
    try {
      setLoading(true)
      const data = await boatsAPI.getAll('all')
      setBoats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- LOGIKA FILTROWANIA I PAGINACJI ---
  
  // 1. Najpierw filtrujemy po nazwie (jeśli jest wpisana)
  const filteredBoats = boats.filter(boat => 
    boat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 2. Obliczamy indeksy dla aktualnej strony
  const indexOfLastBoat = currentPage * boatsPerPage
  const indexOfFirstBoat = indexOfLastBoat - boatsPerPage
  
  // 3. Wycinamy tylko te łodzie, które mają być na tej stronie
  const currentBoats = filteredBoats.slice(indexOfFirstBoat, indexOfLastBoat)

  // 4. Obliczamy ile jest łącznie stron
  const totalPages = Math.ceil(filteredBoats.length / boatsPerPage)

  // Funkcja zmiany strony
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="boats-page-container">
      <div className="section-title-bar">
        <h2>Łodzie</h2>
      </div>

      <div className="search-section">
        <label>Szukaj:</label>
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Wpisz nazwę łodzi..."
          />
        </div>
      </div>

      <div className="boats-content">
        {loading && <div className="loading">Ładowanie...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && filteredBoats.length === 0 && (
          <div className="no-boats">Nie znaleziono łodzi.</div>
        )}

        {/* Renderujemy tylko currentBoats (max 5) */}
        {!loading && currentBoats.length > 0 && (
          <div className="boats-list">
            {currentBoats.map(boat => (
              <BoatCard 
                key={boat.id} 
                boat={boat} 
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- DYNAMICZNA PAGINACJA --- */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button 
              key={index + 1} 
              onClick={() => paginate(index + 1)}
              className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}