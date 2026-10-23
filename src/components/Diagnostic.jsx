import React, { useState } from 'react'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import classify from '../utils/classifier'

const QUESTIONS = [
  {id:'add1', text:'5 + 2 = ?', answer:'7'},
  {id:'mem1', text:'Remember sequence: 2,4,6. What was the second number?', answer:'4'},
  {id:'att1', text:'Which number is biggest: 3,7,5?', answer:'7'}
]

export default function Diagnostic({uid}){
  const [answers, setAnswers] = useState({})
  const [startedAt, setStartedAt] = useState(null)
  const [result, setResult] = useState(null)

  function start(){ setStartedAt(Date.now()); setResult(null); setAnswers({}) }

  async function submit(){
    const duration = Date.now() - startedAt
    let correct = 0
    QUESTIONS.forEach(q => { if((answers[q.id]||'').trim() === q.answer) correct++ })
    const score = Math.round((correct / QUESTIONS.length) * 100)
    const profileLevel = classify(score, {duration, attempts:1})

    const profileRef = doc(db, 'profiles', uid)
    await setDoc(profileRef, {
      lastAssessment: serverTimestamp(),
      score,
      level: profileLevel,
      attempts: 1,
      updatedAt: serverTimestamp()
    }, {merge:true})

    setResult({score, profileLevel, duration})
  }

  return (
    <div className="card">
      <h3>Initial Diagnostic</h3>
      {!startedAt && <button onClick={start}>Start assessment</button>}
      {startedAt && (
        <div>
          {QUESTIONS.map(q=> (
            <div key={q.id} style={{marginBottom:8}}>
              <div>{q.text}</div>
              <input value={answers[q.id]||''} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} />
            </div>
          ))}
          <div style={{display:'flex', gap:8}}>
            <button onClick={submit}>Submit</button>
            <button onClick={()=>setStartedAt(null)}>Cancel</button>
          </div>
        </div>
      )}
      {result && (
        <div style={{marginTop:8}}>
          <div>Score: {result.score}%</div>
          <div>Level: {result.profileLevel}</div>
          <div>Time: {Math.round(result.duration/1000)}s</div>
        </div>
      )}
    </div>
  )
}
