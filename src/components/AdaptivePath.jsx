import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const PATHS = {
  Beginner: ['Counting', 'Number recognition', '1-digit addition'],
  Developing: ['1-digit addition', '2-digit addition', 'Visual aids'],
  Intermediate: ['Word problems', '2-digit subtraction'],
  Mastery: ['Multi-step problems', 'Timed drills']
}

export default function AdaptivePath({uid}){
  const [path, setPath] = useState([])

  useEffect(()=>{
    async function load(){
      const d = await getDoc(doc(db,'profiles',uid))
      if(d.exists()){
        const level = d.data().level || 'Beginner'
        setPath(PATHS[level] || PATHS['Beginner'])
      }
    }
    load()
  },[uid])

  return (
    <div className="card">
      <h3>Recommended Learning Path</h3>
      <ol>
        {path.map(p=> <li key={p}>{p}</li>)}
      </ol>
    </div>
  )
}
