export default function classify(score, meta={}){
  // Simple heuristic classifier for demonstration
  if(score >= 85) return 'Mastery'
  if(score >= 65) return 'Intermediate'
  if(score >= 40) return 'Developing'
  return 'Beginner'
}
