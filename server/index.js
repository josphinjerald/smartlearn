import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(express.json())

const OPENAI_KEY = process.env.OPENAI_API_KEY
if(!OPENAI_KEY){
  console.warn('OPENAI_API_KEY is not set. Tutor endpoint will return an error until configured.')
}

app.post('/api/tutor', async (req, res) => {
  try{
    if(!OPENAI_KEY) return res.status(500).json({error:'OpenAI key not configured'})
    const { prompt, history } = req.body || {}
    if(typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({error:'Please enter a question for the tutor.'})
    }
    if(prompt.length > 4000) {
      return res.status(400).json({error:'Please keep your question under 4,000 characters.'})
    }

    const system = `You are SmartLearn, a supportive college study tutor. Never diagnose, label, or infer a learner's intelligence or ability. Explain concepts in clear, plain English using short, structured steps. Give a hint before a complete solution when the learner asks for help with a practice question. Encourage understanding, point out uncertainty, and recommend checking course materials or an instructor for high-stakes academic work. Respect academic integrity: do not complete submitted assignments or exams; instead, provide explanations, examples, outlines, and feedback.`

    const messages = [
      {role:'system', content: system},
      ...(Array.isArray(history) ? history.slice(-6) : []),
      {role:'user', content: prompt.trim()}
    ]

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 400,
        temperature: 0.7
      })
    })

    if(!resp.ok){
      const txt = await resp.text()
      return res.status(500).json({error:'OpenAI error', detail:txt})
    }

    const data = await resp.json()
    const msg = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : ''
    res.json({reply: msg})
  }catch(err){
    console.error(err)
    res.status(500).json({error: err.message})
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`Tutor API listening on ${PORT}`))
