import React from 'react'
import { Row, Col, Label, Input } from 'reactstrap'
function UploadPhoto({ imgSrc, onChangeFunc, isThereCompany }) {
  return (
    <>
      <Label className='lable-title' for='examplePhone'>
        Şirket Logosu
      </Label>
      <Row className='image-row m-0'>
        <Col
          className='p-0 d-flex flex-column justify-content-around align-items-center'
          xl='6'
          lg='6'
          md='6'
          sm='6'
          xs='6'
        >
          <img className='company-logo' alt='company-logo' src={imgSrc}></img>
        </Col>
        <Col
          className='p-0 d-flex justify-content-center align-items-center '
          xl='6'
          lg='6'
          md='6'
          sm='6'
          xs='6'
        >
          {isThereCompany === true ? <span className='disabled-span'>Logo Yükle</span> : (
            <label htmlFor='upload'>
              <Input
                type='file'
                name='file'
                id='upload'
                onChange={onChangeFunc}
                disabled={isThereCompany}
              />
              <svg>
                <rect x='0' y='0' fill='none' width='100%' height='100%' />
              </svg>
              Logo Yükle
            </label>
          )}
        </Col>
      </Row>
    </>
  )
}

export default UploadPhoto

