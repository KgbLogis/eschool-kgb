import { Card, Col, Divider, Image, Row } from 'antd';
import { REPORT_IMAGE_URL } from 'constants/Url';
import React, { Component } from 'react'

class PrintCard extends Component {

    render() {

        const printingPages = [];
        
        this.props.datas.map(function (item, index) {
            const page = (
                <div key={index} className="page-break" >
                    <Card 
                        style={{ fontFamily: 'Times New Roman', lineHeight: `17px`, color: 'black' }} 
                        className="aaa" 
                        bordered={false}
                    >
                        <Row gutter={[16, 16]}>
                            <Col span={8} className='text-right' >
                                <img
                                    style={{ maxHeight: '100px' }}
                                    src='/img/logo.png' 
                                    alt="logo"
                                />
                            </Col>
                            <Col span={8} >
                                <div className='text-center' >
                                    <b style={{ fontSize: '32px' }} >{item.school}</b>
                                    <div className='text-center mt-3' style={{ fontSize: '11px', lineHeight: `10px` }} dangerouslySetInnerHTML={{ __html: item.textTop }} />
                                </div>
                            </Col>
                            <Col span={8} className='text-left'>
                                <img
                                    style={{ maxHeight: '100px' }}
                                    src={REPORT_IMAGE_URL+item.studentPhoto} 
                                    alt="studentPhoto"
                                />
                            </Col>
                        </Row>
                        <Divider />
                        <Row>
                            <Col span={24} className='text-center' >
                                <b >Суралцагчийн тодорхойлолт</b>
                                <div style={{ fontSize: '15px' }} dangerouslySetInnerHTML={{ __html: item.textMid }} />
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                {/* <p className='text-center' >{item.textBottom}</p> */}
                                <div className='text-center' dangerouslySetInnerHTML={{ __html: item.textBottom }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className='text-center'>
                                <Image 
                                    src={`https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=http%3A%2F%2F${window.location.hostname}%2Freport/student-report%2F${item.studentCode}&chld=H&choe=UTF-8`} 
                                    preview={false}
                                />
                            </Col>
                        </Row>
                    </Card>
                </div>
            )
            return printingPages.push(page);
        })
        return (
            <div>
                {printingPages}
            </div>
        )
    }
}

export default PrintCard