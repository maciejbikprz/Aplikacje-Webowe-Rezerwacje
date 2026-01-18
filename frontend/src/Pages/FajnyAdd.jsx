import React, { useState } from 'react';

// 1. Odbieramy props "onDodano"
function FajnyAdd({ onDodano }) { 
    const [nazwa, setNazwa] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nazwa: nazwa }),
            });

            if (response.ok) {
                setNazwa(''); 
                // 2. ODPALAMY FUNKCJĘ RODZICA -> To odświeży listę w App.js!
                if (onDodano) onDodano(); 
            } else {
                alert('Błąd serwera');
            }
        } catch (error) {
            console.error('Błąd:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{marginBottom: '20px'}}>
            <label>
                Nowy element: 
                <input 
                    type="text" 
                    value={nazwa} 
                    onChange={(e) => setNazwa(e.target.value)} 
                />
                <button type="submit">Dodaj</button>
            </label>
        </form>
    );
}

export default FajnyAdd;