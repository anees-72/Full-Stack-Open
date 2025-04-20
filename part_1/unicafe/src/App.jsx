import {useState} from 'react'

const App= () => {
  const[good, setGood] = useState(0)
  const[neutral, setNeutral] = useState(0)
  const[bad, setBad] = useState(0)

  return(
    <>
    <h1>give feedback</h1>
    <Button onclick={() => setGood(good + 1)} text="good" />
    <Button onclick={() => setNeutral(neutral + 1)} text="neutral" />
    <Button onclick={() => setBad(bad + 1)} text="bad" />
    <br />
    <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}
const Statistics = (props) =>{
  
  if (props.good + props.neutral + props.bad === 0) {
    return (<><h1>statistics</h1> 
    <p>No feedback given </p></>)
  }
  else{
  return(
    <div>
    <h1>statistics</h1>
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.good} />
        <StatisticsLine text="neutral" value={props.neutral} />
        <StatisticsLine text="bad" value={props.bad} />
        <StatisticsLine text="all" value={props.good + props.neutral + props.bad} />
        <StatisticsLine text="average" value={((props.good - props.bad) / (props.good + props.neutral + props.bad)).toFixed(2)} />
        <StatisticsLine text="positive" value={((props.good / (props.good + props.neutral + props.bad)) * 100).toFixed(2) + " %"} />
      </tbody>
    </table>
    </div>
  )}
}

const StatisticsLine = (props) => {
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}
const Button = (props) => {
  return(
    <button onClick={props.onclick}>{props.text}</button>
  )
}
export default App