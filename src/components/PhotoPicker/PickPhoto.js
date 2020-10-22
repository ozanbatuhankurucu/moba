import React from 'react';
import {Container,Row,Col,Input,Label} from 'reactstrap';
import './pickphoto.scss';
function PickPhoto({handleImage,imageUrl,isRequired,labelTitle}){
    console.log(imageUrl)
    return (
        <Container className='p-0 pickphoto-cont' fluid>
        <Row>
            <Col>
            <Label className='lable-title' for='exampleName'>
        {labelTitle} {isRequired && <span className='star'>*</span>}
      </Label>
            </Col>
        </Row>
            <Row className='pickphoto-row m-0'>
                <Col className='left p-0'>{imageUrl===null ? <div className='pt-3 pl-3'>
                    <b>Herhangi bir logo yüklemediniz.</b>
                </div> : (<img className='company-logo' src={imageUrl}></img>)}</Col>
                <Col className='right'>
                    <Input
                    type='file'
                    onChange={handleImage}
                    >

                    </Input>
                </Col>
            </Row>
        </Container>
    );
}

export default PickPhoto;