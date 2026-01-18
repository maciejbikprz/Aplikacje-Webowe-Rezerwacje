import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function Register() {
  const [d, sD] = useState({}) // "d" jak data
  const nav = useNavigate()

  const sub = async (e) => {
    e.preventDefault()
    // Zero sprawdzania czy hasła są takie same, od razu strzał
    try {
      await authAPI.register(d.firstName, d.lastName, d.email, d.password)
      nav('/login')
    } catch (e) { alert(e.message) } // Błąd prosto na twarz userowi
  }

  // Inline handler
  const ch = e => sD({...d, [e.target.name]: e.target.value})

  return (
    <form onSubmit={sub} style={{ padding: 20 }}>
      <h3>Register</h3>
      <input name="firstName" placeholder="Imię" onChange={ch} required /><br/><br/>
      <input name="lastName" placeholder="Nazwisko" onChange={ch} required /><br/><br/>
      <input name="email" type="email" placeholder="Email" onChange={ch} required /><br/><br/>
      <input name="password" type="password" placeholder="Hasło" onChange={ch} required /><br/><br/>
      {/* Usunąłem confirmPassword bo API tego nie przyjmuje, a to wersja minimum */}
      <button>Zarejestruj się</button>
      <hr/>
      <Link to="/login">Login</Link>
    </form>
  )
}