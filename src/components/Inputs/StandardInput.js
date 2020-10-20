import React from 'react'
import { Label } from 'reactstrap'
import styled from 'styled-components'

const StyledInput = styled.input`
background-color: #ffffff;
border: 1px solid #dddddd;
border-radius: 4px;
color: #66615b;
line-height: normal;
font-size: 14px;
transition: color 0.3s ease-in-out, border-color 0.3s ease-in-out,
  background-color 0.3s ease-in-out;
box-shadow: none;
padding: 10px 10px 10px 10px;
display: block;
width: 100%;
`

function StandardInput({
  labelTitle,
  isRequired,
  inputName,
  isThereCompany,
  emptyControl,
  inputType,
  refTemp,
  emptyErrorMessage,
  defaultVal,
  emailErrorMessage
}) {
 
  console.log(emailErrorMessage)

  return (
    <>
      <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      <StyledInput
        type='textarea'
        name={inputName}
        ref={refTemp}
        disabled={isThereCompany}
        defaultValue={defaultVal}
      />
      {emptyControl && <mark>{emptyErrorMessage}</mark>}
      {emailErrorMessage!==undefined ? (emptyControl && <div><mark>{emailErrorMessage}</mark></div>) : null}
    </>
  )
}

export default StandardInput
