import React from 'react'
import { FormGroup, Label, Input } from 'reactstrap'
import './maskedphone.scss'
function MaskedPhoneInput({
  labelTitle,
  inputName,
  isRequired,
  refTemp,
  emptyControl,
  maskedInput,
  inputMask,
  defaultVal,
}) {
  return (
    <FormGroup className='masked-phone-input'>
      <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      <Input
        type='tel'
        name={inputName}
        mask={inputMask}
        maskChar=' '
        tag={maskedInput}
        inputRef={refTemp}
        defaultValue={defaultVal}
      ></Input>
      {emptyControl ? (
        <p className='error-message'>{emptyControl.message}</p>
      ) : null}
    </FormGroup>
  )
}

export default MaskedPhoneInput
