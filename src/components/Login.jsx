import React, { useState } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { signIn, signUp, db } from '../firebase'
import './Login.css'

const supportOptions = [
	'Shorter steps',
	'More examples',
	'Audio support',
	'Extra practice'
]

export default function Login(){
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [mode, setMode] = useState('signin')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [learner, setLearner] = useState({
		name: '',
		studyLevel: '',
		sessionLength: '15 minutes',
		weeklyHours: '5–7 hours',
		bestStudyTime: 'Evening',
		confidence: 'I am building confidence',
		learningFormat: 'Examples and pictures',
		studyBarrier: '',
		focusTopic: '',
		support: []
	})
	const isSignup = mode === 'signup'

	function updateLearner(field, value){
		setLearner(current => ({...current, [field]: value}))
	}

	function toggleSupport(option){
		setLearner(current => ({
			...current,
			support: current.support.includes(option)
				? current.support.filter(item => item !== option)
				: [...current.support, option]
		}))
	}

	async function submit(event){
		event.preventDefault()
		setError('')
		if(isSignup && password !== confirmPassword){
			setError('The passwords do not match.')
			return
		}

		setLoading(true)
		try{
			if(!isSignup){
				await signIn(email, password)
				return
			}

			const credential = await signUp(email, password)
			await setDoc(doc(db, 'profiles', credential.user.uid), {
				name: learner.name.trim(),
				studyProfile: {
					studyLevel: learner.studyLevel,
					comfortableSessionLength: learner.sessionLength,
					weeklyStudyCapacity: learner.weeklyHours,
					preferredStudyTime: learner.bestStudyTime,
					selfReportedConfidence: learner.confidence,
					preferredLearningFormat: learner.learningFormat,
					currentStudyBarrier: learner.studyBarrier,
					focusTopic: learner.focusTopic.trim(),
					requestedSupports: learner.support
				},
				dailyGoal: learner.sessionLength === '10 minutes' ? 20 : learner.sessionLength === '15 minutes' ? 30 : learner.sessionLength === '25 minutes' ? 45 : 30,
				weeklyStudyHours: {'1–3 hours':2,'3–5 hours':4,'5–7 hours':6,'8+ hours':9}[learner.weeklyHours],
				onboardingComplete: true,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp()
			}, {merge: true})
		}catch(err){
			const messages = {
				'auth/invalid-credential': 'Incorrect email or password.',
				'auth/email-already-in-use': 'An account already exists for this email.',
				'auth/weak-password': 'Choose a password with at least 6 characters.'
			}
			setError(messages[err.code] || err.message || 'We could not complete that request. Please try again.')
		}finally{
			setLoading(false)
		}
	}

	function switchMode(){
		setMode(isSignup ? 'signin' : 'signup')
		setError('')
	}

	return (
		<main className="auth-page">
			<section className="auth-aside">
				<a className="logo" href="#top"><span>✦</span>SmartLearn</a>
				<div className="auth-aside-copy">
					<p className="eyebrow">A STUDY SPACE THAT ADAPTS</p>
					<h1>Make room<br/>to learn your way.</h1>
					<p>Build confidence with clear lessons, useful practice, and a pace that feels manageable.</p>
				</div>
				<div className="auth-points">
					<span><b>01</b> Choose a comfortable pace</span>
					<span><b>02</b> Learn with the formats you like</span>
					<span><b>03</b> Change your preferences anytime</span>
				</div>
				<div className="auth-aside-mark" aria-hidden="true">S<span>+</span></div>
			</section>

			<form className="auth-card" onSubmit={submit}>
				<div className="auth-card-heading">
					<p className="eyebrow">{isSignup ? 'YOUR LEARNING STARTS HERE' : 'WELCOME BACK'}</p>
					<h1>{isSignup ? 'Create your account' : 'Sign in to SmartLearn'}</h1>
					<p>{isSignup ? 'A few quick answers help us shape a useful starting point.' : 'Continue with your email and password.'}</p>
				</div>

				{isSignup && <div className="signup-fields">
					<div className="auth-field">
						<label htmlFor="learner-name">What should we call you?</label>
						<input id="learner-name" autoComplete="name" required maxLength={50} placeholder="Your name" value={learner.name} onChange={event=>updateLearner('name', event.target.value)}/>
					</div>

					<div className="auth-field">
						<label htmlFor="study-level">What are you studying right now?</label>
						<select id="study-level" required value={learner.studyLevel} onChange={event=>updateLearner('studyLevel', event.target.value)}>
							<option value="" disabled>Select a level</option>
							<option>Middle school</option>
							<option>High school</option>
							<option>College or university</option>
							<option>Other or self-study</option>
						</select>
					</div>

					<fieldset className="auth-field">
						<legend>How long does a study session feel comfortable? <span className="optional-label">There is no right answer</span></legend>
						<div className="choice-row">
							{['10 minutes', '15 minutes', '25 minutes', 'It varies'].map(length=><label className="choice-pill" key={length}>
								<input type="radio" name="session-length" value={length} checked={learner.sessionLength===length} onChange={event=>updateLearner('sessionLength', event.target.value)}/>
								<span>{length}</span>
							</label>)}
						</div>
					</fieldset>

					<div className="capacity-grid">
						<fieldset className="auth-field">
							<legend>Time you can usually study each week</legend>
							<div className="choice-row">
								{['1–3 hours', '3–5 hours', '5–7 hours', '8+ hours'].map(hours=><label className="choice-pill" key={hours}>
									<input type="radio" name="weekly-hours" value={hours} checked={learner.weeklyHours===hours} onChange={event=>updateLearner('weeklyHours', event.target.value)}/>
									<span>{hours}</span>
								</label>)}
							</div>
						</fieldset>

						<div className="auth-field">
							<label htmlFor="study-time">When do you usually have the most energy?</label>
							<select id="study-time" value={learner.bestStudyTime} onChange={event=>updateLearner('bestStudyTime', event.target.value)}>
								<option>Morning</option>
								<option>Afternoon</option>
								<option>Evening</option>
								<option>It changes day to day</option>
							</select>
						</div>
					</div>

					<fieldset className="auth-field">
						<legend>How do you feel about your current course work?</legend>
						<div className="choice-row">
							{['I feel confident', 'I am building confidence', 'I need a clear restart'].map(confidence=><label className="choice-pill" key={confidence}>
								<input type="radio" name="confidence" value={confidence} checked={learner.confidence===confidence} onChange={event=>updateLearner('confidence', event.target.value)}/>
								<span>{confidence}</span>
							</label>)}
						</div>
					</fieldset>

					<div className="auth-field">
						<label htmlFor="learning-format">What helps you learn a new idea?</label>
						<select id="learning-format" value={learner.learningFormat} onChange={event=>updateLearner('learningFormat', event.target.value)}>
							<option>Examples and pictures</option>
							<option>Short written steps</option>
							<option>Listening and audio</option>
							<option>Trying practice questions</option>
							<option>A mix of these</option>
						</select>
					</div>

					<div className="auth-field">
						<label htmlFor="study-barrier">What makes study sessions harder right now? <span className="optional-label">Optional</span></label>
						<select id="study-barrier" value={learner.studyBarrier} onChange={event=>updateLearner('studyBarrier', event.target.value)}>
							<option value="">Choose one if it helps</option>
							<option>Finding enough time</option>
							<option>Knowing where to begin</option>
							<option>Remembering what I read</option>
							<option>Understanding technical terms</option>
							<option>Staying focused</option>
						</select>
					</div>

					<fieldset className="auth-field">
						<legend>What would you like more of? <span className="optional-label">Choose any</span></legend>
						<div className="choice-row support-choices">
							{supportOptions.map(option=><label className="choice-pill" key={option}>
								<input type="checkbox" checked={learner.support.includes(option)} onChange={()=>toggleSupport(option)}/>
								<span>{option}</span>
							</label>)}
						</div>
					</fieldset>

					<div className="auth-field">
						<label htmlFor="focus-topic">A subject or topic you want to work on <span className="optional-label">Optional</span></label>
						<input id="focus-topic" maxLength={100} placeholder="For example, fractions or reading" value={learner.focusTopic} onChange={event=>updateLearner('focusTopic', event.target.value)}/>
					</div>
					<p className="profile-note">These answers help create a realistic study plan. They are not a test, score, or diagnosis, and you can edit or delete them later.</p>
				</div>}

				<div className="auth-credentials">
					<div className="auth-field">
						<label htmlFor="auth-email">Email address</label>
						<input id="auth-email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={event=>setEmail(event.target.value)}/>
					</div>
					<div className="auth-field">
						<label htmlFor="auth-password">Password</label>
						<input id="auth-password" type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} required minLength={6} placeholder="At least 6 characters" value={password} onChange={event=>setPassword(event.target.value)}/>
					</div>
					{isSignup && <div className="auth-field">
						<label htmlFor="auth-confirm-password">Confirm password</label>
						<input id="auth-confirm-password" type="password" autoComplete="new-password" required minLength={6} placeholder="Enter your password again" value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)}/>
					</div>}
				</div>

				{error && <p className="form-error" role="alert">{error}</p>}
				<button className="primary auth-submit" type="submit" disabled={loading}>
					{loading ? 'Please wait…' : isSignup ? 'Create learning account' : 'Sign in'} <span aria-hidden="true">→</span>
				</button>
				<p className="auth-switch">
					{isSignup ? 'Already have an account?' : 'New to SmartLearn?'}{' '}
					<button type="button" className="text-action" onClick={switchMode}>{isSignup ? 'Sign in' : 'Create an account'}</button>
				</p>
			</form>
		</main>
	)
}
