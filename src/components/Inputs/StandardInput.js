import React from 'react'
import { Label,Input } from 'reactstrap'




function StandardInput({
  labelTitle,
  isRequired,
  inputName,
  isThereCompany,
  emptyControl,
  inputType,
  refTemp,
  defaultVal,
  emailErrorMessage
}) {
 
  console.log(emailErrorMessage)
  console.log(emptyControl)

  return (
    <>
      <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      <Input
        type={inputType}
        name={inputName}
        innerRef={refTemp}
        disabled={isThereCompany}
        defaultValue={defaultVal}
      />
      {emptyControl ? <mark>{emptyControl.message}</mark> : null}

    </>
  )
}

export default StandardInput
