import React, { useState } from 'react'
import speak from '../utils/tts'

const LOCAL_HINTS = {
  '7+5': [
    "Let's count 7 objects first.",
    'Now add 5 more objects.',
    'How many objects do you see?'
  ]
}

export default function Tutor(){
  const [prompt, setPrompt] = useState('I need help with 7 + 5')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_TUTOR_API_URL || '/api/tutor'

  async function ask(){
    setLoading(true)
    try{
      const payload = { prompt, history }
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })

      if(!res.ok){
        // fallback to local hints
        const seq = LOCAL_HINTS['7+5'] || ['Try to break the problem into smaller steps.']
        const reply = seq[0]
        speak(reply)
        setHistory(h=>[...h, {role:'assistant', content:reply}])
        return
      }

      const data = await res.json()
      const reply = data.reply || 'Sorry, I could not generate a response.'
      speak(reply)
      setHistory(h=>[...h, {role:'assistant', content:reply}, {role:'user', content:prompt}])
    }catch(err){
      console.error(err)
      const seq = LOCAL_HINTS['7+5'] || ['Try to break the problem into smaller steps.']
      const reply = seq[0]
      speak(reply)
      setHistory(h=>[...h, {role:'assistant', content:reply}])
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>AI Tutor</h3>
      <div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={3} style={{width:'100%'}} />
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <button onClick={ask} disabled={loading}>{loading ? 'Thinking...' : 'Ask Tutor'}</button>
        </div>
      </div>
      <div style={{marginTop:12}}>
        <h4>Conversation</h4>
        <div>
          {history.slice().reverse().map((m, i)=> (
            <div key={i} style={{padding:6, borderRadius:6, background:m.role==='assistant' ? '#eef' : '#f3f3f3', marginBottom:6}}>
              <strong>{m.role}:</strong> {m.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
