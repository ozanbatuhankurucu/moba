import React from 'react'
import { Label, Input } from 'reactstrap'
function StandardInput({
  labelTitle,
  isRequired,
  inputName,
  cssId,
  value,
  onChangeFunc,
  isThereCompany,
  emptyControl,
  emptyErrorMessage,
  inputType
}) {
  return (
    <>
      <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      <Input
        type={inputType}
        name={inputName}
        id={cssId}
        value={value}
        onChange={onChangeFunc}
        disabled={isThereCompany}
      />
      {emptyControl && <mark>{emptyErrorMessage}</mark>}
    </>
  )
}

export default StandardInput
