import React from 'react'
import { Label } from 'reactstrap'
//Phone Selecter Packages
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
function PhoneInputCustom({
  labelTitle,
  isRequired,
  inputName,
  value,
  onChangeFunc,
  isThereCompany,
  emptyControl,
  emptyErrorMessage,
}) {
  return (
    <>
      <Label className='lable-title' for='examplePhone'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
      <PhoneInput
        inputStyle={
          isThereCompany === true
            ? { backgroundColor: '#E3E3E3', paddingLeft: '48px' }
            : { paddingLeft: '48px' }
        }
        name={inputName}
        //istenilen ulkeleri ekleyebiliyoruz buraya.
        onlyCountries={['tr']}
        country={'tr'}
        value={value}
        onChange={onChangeFunc}
        disabled={isThereCompany && true}
      />
      {emptyControl && <mark>{emptyErrorMessage}</mark>}
    </>
  )
}

export default PhoneInputCustom
