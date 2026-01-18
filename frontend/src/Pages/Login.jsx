import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function Login({ setIsAuthenticated, setUserRole }) {
  const [d, sD] = useState({}) // d jak data
  const nav = useNavigate()

  const sub = async (e) => {
    e.preventDefault()
    try {
      const res = await authAPI.login(d.email, d.password)
      
      // Wrzucamy wszystko "na żywca" do storage
      localStorage.setItem('token', res.token)
      localStorage.setItem('userRole', res.user.role)
      localStorage.setItem('userId', res.user.id)
      
      // Aktualizujemy App.js
      setIsAuthenticated(true)
      setUserRole(res.user.role)
      
      nav('/')
    } catch (e) { alert(e.message) }
  }

  const ch = e => sD({...d, [e.target.name]: e.target.value})

  return (
    <form onSubmit={sub} style={{ padding: 20 }}>
      <h3 className='main-homepage-header'>Login</h3>
      <input name="email" type="email" placeholder="Email" onChange={ch} required /><br/><br/>
      <input name="password" type="password" placeholder="Hasło" onChange={ch} required /><br/><br/>
      <button>Zaloguj</button>
      <hr/>
      <Link to="/register">Rejestracja</Link>
    </form>
  )
}