import  { useState,forwardRef, useImperativeHandle } from 'react'

const Toggleable = forwardRef((props,ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible? 'none' : '' }
  const showWhenHidden =  { display: visible? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenHidden}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )

})

Toggleable.displayName = 'Toggleable'
export default Toggleable