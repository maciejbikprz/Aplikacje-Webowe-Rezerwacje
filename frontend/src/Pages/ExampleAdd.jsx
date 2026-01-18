import React, { useState, useEffect } from 'react';

// --- 1. FUNKCJA LOGOWANIA (pomocnicza) ---
async function loginAndSaveToken() {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: "admin@admin", password: "admin123" })
    });

    const data = await res.json();
    const token = data.token; // lub data.accessToken zależnie od backendu
    
    if (token) {
      localStorage.setItem('jwt_token', token);
      console.log('Zalogowano automatycznie! Token:', token);
      return true;
    } else {
      console.error('Błąd logowania:', data);
      return false;
    }
  } catch (e) {
    console.error("Błąd połączenia logowania:", e);
    return false;
  }
}

// --- 2. KOMPONENT DODAWANIA (Dziecko) ---
function FajnyAdd({ onDodano }) {
    const [formData, setFormData] = useState({
        name: "Testowa Łódź",
        type: "Jacht",
        description: "Opis",
        capacity: 5,
        pricePerDay: "100",
        length: 10,
        status: "available",
        image: "brak"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');

        if (!token) {
            alert("Brak tokena! Autoryzacja nie powiodła się.");
            return;
        }

        try {
            const res = await fetch('/api/boats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                // Sukces -> wywołujemy odświeżanie w rodzicu
                onDodano(); 
                alert("Dodano łódź!");
            } else {
                alert("Błąd dodawania: " + res.status);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            <h3>Formularz dodawania</h3>
            <div style={{ display: 'grid', gap: '5px' }}>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Nazwa" />
                <input name="type" value={formData.type} onChange={handleChange} placeholder="Typ" />
                <input name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Cena" />
                {/* ... reszta pól ... */}
            </div>
            <button type="submit" style={{ marginTop: '10px' }}>Dodaj (z Tokenem)</button>
        </form>
    );
}

// --- 3. KOMPONENT GŁÓWNY (Rodzic) ---
export default function ExampleAdd() {
    const [items, setItems] = useState([]);

    // Funkcja pobierająca (zdefiniowana TU, gdzie jest stan items)
    const pobierzDane = () => {
        fetch('/api/boats')
            .then(res => res.json())
            .then(data => {
                const tablica = data.data ? data.data : data; 
                setItems(Array.isArray(tablica) ? tablica : []);
            })
            .catch(err => console.error("Błąd pobierania:", err));
    };

    // Start aplikacji: Logowanie -> potem pobranie danych
    useEffect(() => {
        const init = async () => {
            await loginAndSaveToken(); // Czekamy na token
            pobierzDane();             // Dopiero wtedy pobieramy listę
        };
        init();
    }, []);

    const usunElement = async (id) => {
        const token = localStorage.getItem('jwt_token');
        if (!confirm("Usunąć?")) return;

        try {
            const res = await fetch(`/api/boats/${id}`, { // Upewnij się co do endpointu (boats vs boatss)
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (res.ok) pobierzDane();
        } catch (err) { console.error(err); }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Menedżer Łodzi</h1>
            
            {/* Przekazujemy funkcję pobierzDane jako onDodano do dziecka */}
            <FajnyAdd onDodano={pobierzDane} />

            <hr />
            <h3>Lista:</h3>
            <ul>
                {items.map((item) => (
                    <li key={item.id || item._id} style={{ marginBottom: '5px' }}>
                        <strong>{item.name}</strong> ({item.type}) 
                        <button onClick={() => usunElement(item.id || item._id)} style={{ marginLeft: '10px', color: 'red' }}>Usuń</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}