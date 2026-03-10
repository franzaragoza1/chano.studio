'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

interface PortfolioItem {
  id: number
  title: string
  label: string
  service: string
  image: string
  alt: string
  embedType: string
  embedSrc: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [works, setWorks] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  // Editing state
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({})
  const [saveLoading, setSaveLoading] = useState(false)

  // Try to use saved auth on load
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth')
    if (savedAuth) {
      handleLogin(savedAuth)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (passToTry = password) => {
    if (!passToTry) return
    
    try {
      setLoading(true)
      // We do a dummy POST to see if auth works, or just fetch works
      const res = await fetch('/api/works', {
        headers: {
          'Authorization': `Bearer ${passToTry}`
        }
      })
      
      if (!res.ok && res.status === 401) {
        setError('Incorrect password')
        sessionStorage.removeItem('admin_auth')
        setIsAuthenticated(false)
      } else {
        const data = await res.json()
        setWorks(data)
        setIsAuthenticated(true)
        sessionStorage.setItem('admin_auth', passToTry)
        setError('')
      }
    } catch (err) {
      console.error(err)
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveLoading(true)
    
    let updatedWorks = [...works]
    const currentPass = sessionStorage.getItem('admin_auth') || ''

    if (isAddingNew) {
      const newItem = {
        ...formData,
        id: Date.now(), // Generate unique ID
      } as PortfolioItem
      updatedWorks = [newItem, ...updatedWorks]
    } else if (editingItem) {
      updatedWorks = updatedWorks.map(w => 
        w.id === editingItem.id ? { ...w, ...formData } as PortfolioItem : w
      )
    }

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentPass}`
        },
        body: JSON.stringify(updatedWorks)
      })

      if (res.ok) {
        setWorks(updatedWorks)
        setEditingItem(null)
        setIsAddingNew(false)
        setFormData({})
      } else {
        alert("Error saving data. Make sure Redis is configured in Vercel.")
      }
    } catch (err) {
      alert("Failed to save changes")
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this work?')) return
    
    const updatedWorks = works.filter(w => w.id !== id)
    const currentPass = sessionStorage.getItem('admin_auth') || ''

    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentPass}`
        },
        body: JSON.stringify(updatedWorks)
      })

      if (res.ok) setWorks(updatedWorks)
    } catch (err) {
      alert("Failed to delete")
    }
  }

  const handleEditClick = (item: PortfolioItem) => {
    setEditingItem(item)
    setIsAddingNew(false)
    setFormData(item)
  }

  const handleAddClick = () => {
    setEditingItem(null)
    setIsAddingNew(true)
    setFormData({
      title: '', label: '', service: '', image: '', alt: '', embedType: 'spotify', embedSrc: ''
    })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // LOGIN SCREEN
  if (!isAuthenticated && !loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f', color: '#fff' }}>
        <div style={{ padding: '40px', background: '#1a1a1a', borderRadius: '12px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '5px', letterSpacing: '2px', fontSize: '24px' }}>CHANO STUDIO</h1>
          <p style={{ color: '#888', marginBottom: '30px', fontSize: '14px' }}>Admin Dashboard</p>
          
          <input 
            type="password" 
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px', marginBottom: '15px' }}
          />
          {error && <p style={{ color: '#ff4444', fontSize: '14px', marginBottom: '15px' }}>{error}</p>}
          
          <button 
            onClick={() => handleLogin()}
            style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            LOGIN
          </button>
          
          <div style={{ marginTop: '20px' }}>
            <Link href="/" style={{ color: '#666', fontSize: '12px', textDecoration: 'none' }}>← Back to site</Link>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', paddingBottom: '100px' }}>
      <header style={{ borderBottom: '1px solid #222', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
        <div>
          <h1 style={{ fontSize: '20px', margin: 0, letterSpacing: '1px' }}>ADMIN DASHBOARD</h1>
          <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>Manage your portfolio</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <ThemeToggle />
          <Link href="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '14px' }}>View Site</Link>
          <button 
            onClick={() => { sessionStorage.removeItem('admin_auth'); setIsAuthenticated(false); }}
            style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        
        {/* EDIT / ADD FORM */}
        {(isAddingNew || editingItem) && (
          <div style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '25px', marginBottom: '40px' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>{isAddingNew ? 'Add New Work' : 'Edit Work'}</h2>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Title (e.g. ARTIST - SONG)</label>
                  <input required name="title" value={formData.title || ''} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Label (e.g. RECORD LABEL)</label>
                  <input name="label" value={formData.label || ''} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Service Provided</label>
                  <input required name="service" value={formData.service || ''} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Cover Image URL (.jpg / .png)</label>
                  <input required name="image" value={formData.image || ''} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Image Alt Text</label>
                  <input name="alt" value={formData.alt || ''} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Embed Type</label>
                  <select name="embedType" value={formData.embedType || 'spotify'} onChange={handleFormChange} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}>
                    <option value="spotify">Spotify</option>
                    <option value="bandcamp">Bandcamp</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#888' }}>Embed Source (Iframe src link)</label>
                  <textarea required name="embedSrc" value={formData.embedSrc || ''} onChange={handleFormChange} rows={3} style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={saveLoading} style={{ background: '#fff', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {saveLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => { setIsAddingNew(false); setEditingItem(null); }} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LIST OF WORKS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Current Works ({works.length})</h2>
          {!isAddingNew && !editingItem && (
            <button onClick={handleAddClick} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
              + Add New Work
            </button>
          )}
        </div>

        {loading && <p style={{ color: '#888' }}>Loading your works...</p>}
        
        <div style={{ display: 'grid', gap: '15px' }}>
          {works.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#111', border: '1px solid #222', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={item.image} alt={item.alt} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', background: '#222' }} />
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{item.title}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>{item.service} • {item.embedType}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditClick(item)} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} style={{ background: '#3a1111', border: '1px solid #ff4444', color: '#ff4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {works.length === 0 && !loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666', border: '1px dashed #333', borderRadius: '8px' }}>
              No works found. Add your first portfolio item!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
