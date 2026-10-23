import React, { useState } from 'react'

export default function Game(){
  const [score, setScore] = useState(0)

  function play(){
    // simple memory mini-game placeholder
    const ok = confirm('Remember this sequence: red, blue, green. Click OK when ready to answer.')
    if(ok){
      const ans = prompt('What was the second color?')
      if(ans && ans.toLowerCase().includes('blue')) setScore(s=>s+10)
      else setScore(s=>s-5)
    }
  }

  return (
    <div className="card">
      <h3>Mini-Game: Memory Match</h3>
      <div>Score: {score}</div>
      <div style={{marginTop:8}}><button onClick={play}>Play</button></div>
    </div>
  )
}
