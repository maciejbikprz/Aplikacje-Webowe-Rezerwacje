import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { boatsAPI } from '../services/api';
import ReservationModal from '../Components/ReservationModal'; 

export default function Boat({ isAuthenticated }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Stany danych
    const [boat, setBoat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Stan modala
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBoat = async () => {
            try {
                const data = await boatsAPI.getById(id);
                setBoat(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoat();
    }, [id]);

    // Logika rezerwacji (identyczna jak w BoatCard)
    const handleReserve = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    if (loading) return <div className="boat-details-wrapper"><div>Ładowanie...</div></div>;
    if (error) return <div className="boat-details-wrapper"><div>Błąd: {error}</div></div>;
    if (!boat) return <div className="boat-details-wrapper"><div>Łódź nie znaleziona</div></div>;

    return (
        <>
            <div className="boat-details-wrapper">
                <div className="boat-details">
                    <h1>{boat.name}</h1>
                    <p><strong>Typ:</strong> {boat.type}</p>
                    <p><strong>Pojemność:</strong> {boat.capacity} osób</p>
                    <p><strong>Cena:</strong> {boat.price} zł/dzień</p>
                    <p><strong>Opis:</strong> {boat.description}</p>
                    
                    <div className="boat-action-area">
                        <button onClick={handleReserve}>Zarezerwuj</button>
                    </div>
                </div>
            </div>

            {/* Modal rezerwacji */}
            {showModal && (
                <ReservationModal 
                    boat={boat} 
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        navigate('/dashboard');
                    }}
                />
            )}
        </>
    );
}