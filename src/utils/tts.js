export default function speak(text){
  if(!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.9
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}
