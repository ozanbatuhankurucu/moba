import React from 'react'
import { Label } from 'reactstrap'
//Phone Selecter Packages
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
function PhoneInputCustom({
  labelTitle,
  isRequired,
  inputName,
  defaultVal,
  onChangeFunc,
  isThereCompany,
  emptyControl,
  emptyErrorMessage,
  refTemp
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
        ref={refTemp}
        onlyCountries={['tr']}
        country={'tr'}
        value={defaultVal}
        onChange={onChangeFunc}
        disabled={isThereCompany && true}
      />
      {emptyControl && <mark>{emptyErrorMessage}</mark>}
    </>
  )
}

export default PhoneInputCustom
