import React from 'react'
import { Label, Input } from 'reactstrap'

function StandardInput({
  labelTitle,
  isRequired,
  inputName,
 
  emptyControl,
  inputType,
  refTemp,
  defaultVal,
  emailErrorMessage,
  isPhone,
  maxLen,
}) {
  console.log(emailErrorMessage)
  console.log(emptyControl)

  return (
    <>
      <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      {isPhone !== undefined ? <span> test yazisi</span> : null}
      <Input
        maxLength={maxLen}
        type={inputType}
        name={inputName}
        innerRef={refTemp}
      
        defaultValue={defaultVal}
      />
      {emptyControl ? (
        <p style={{ color: 'red' }}>{emptyControl.message}</p>
      ) : null}
    </>
  )
}

export default StandardInput
