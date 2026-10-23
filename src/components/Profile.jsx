import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export default function Profile({uid}){
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
      <h3>Learner Profile</h3>
      {profile ? (
        <div>
          <div>Level: {profile.level}</div>
          <div>Score: {profile.score}%</div>
          <div>Attempts: {profile.attempts||0}</div>
        </div>
      ) : <div>No profile yet. Complete the diagnostic.</div>}
    </div>
  )
}
