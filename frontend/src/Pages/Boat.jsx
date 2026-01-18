import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Boat() {
    const { id } = useParams();
    const [boat, setBoat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoat = async () => {
            try {
                const response = await fetch(`/api/boats/${id}`);
                if (!response.ok) throw new Error('Failed to fetch boat');
                const data = await response.json();
                setBoat(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBoat();
    }, [id]);

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!boat) return <div>Łódź nie znaleziona</div>;

    return (
        <div className="boat-details">
            <h1>{boat.name}</h1>
            <p><strong>Typ:</strong> {boat.type}</p>
            <p><strong>Pojemność:</strong> {boat.capacity} osób</p>
            <p><strong>Cena:</strong> {boat.price} zł/dzień</p>
            <p><strong>Opis:</strong> {boat.description}</p>
            <button>Zarezerwuj</button>
        </div>
    );
}