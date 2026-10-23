import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function Dashboard({uid}){
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    async function load(){
      const d = await getDoc(doc(db,'profiles',uid))
      if(d.exists()) setProfile(d.data())
    }
    load()
  },[uid])

  return (
    <div className="card">
      <h3>Teacher / Parent Dashboard</h3>
      {profile ? (
        <div>
          <div><strong>Level:</strong> {profile.level}</div>
          <div><strong>Score:</strong> {profile.score}%</div>
          <div><strong>Last activity:</strong> {profile.updatedAt ? profile.updatedAt.toDate().toLocaleString() : '—'}</div>
        </div>
      ) : <div>No data yet.</div>}
    </div>
  )
}
