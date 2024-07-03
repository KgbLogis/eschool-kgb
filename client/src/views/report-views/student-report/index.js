import { useQuery } from '@apollo/client';
import { Card, Col, Divider, Image, Result, Row } from 'antd';
import Loading from 'components/shared-components/Loading';
import { REPORT_IMAGE_URL } from 'constants/Url';
import { STUDENT_REPORT } from 'graphql/report';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const StudentReport = () => {

    const { slug } = useParams();
    const [data, setData] = useState({});

    const { loading, error } = useQuery(STUDENT_REPORT, {
        variables: { studentCode: slug },
        onCompleted: data => {
            setData(data.studentReport);
        }
    });

    if (error && error.message === 'Student matching query does not exist.') {
        return(
            <Result 
                status="404"
                title="Илэрц олдсонгүй"
                subTitle="Уг суралцагч олдсонгүй"
            />
        )
    }

    if (loading) {
        return <Loading cover='content' />
    }

	return (
        <Card 
            style={{ fontFamily: 'Times New Roman', lineHeight: `17px`, color: 'black' }} 
            className="aaa" 
            bordered={false}
        >
            <Row gutter={[16, 16]}>
                <Col span={8} className='text-right' >
                    <Image
                        style={{ maxHeight: '100px' }}
                        src='/img/logo-white.png' 
                        preview={false}
                    />
                </Col>
                <Col span={8} >
                    <div className='text-center' >
                        <b style={{ fontSize: '32px' }} >{data.school}</b>
                        <div className='text-center mt-3' style={{ fontSize: '11px', lineHeight: `10px` }} dangerouslySetInnerHTML={{ __html: data.textTop }} />
                    </div>
                </Col>
                <Col span={8} className='text-left'>
                    <Image
                        style={{ maxHeight: '100px'}}
                        src={REPORT_IMAGE_URL+data.studentPhoto} 
                        preview={false}
                    />
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24} className='text-center' >
                    <b >Суралцагчийн тодорхойлолт</b>
                    <div style={{ fontSize: '15px' }} dangerouslySetInnerHTML={{ __html: data.textMid }} />
                </Col>
            </Row>
            <Divider />
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <div className='text-center' dangerouslySetInnerHTML={{ __html: data.textBottom }} />
                </Col>
            </Row>
            <Row>
                <Col span={24} className='text-center'>
                    <Image 
                        src={`https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=http%3A%2F%2F${window.location.hostname}%2Fstudent-report%2F${data.studentCode}&chld=H&choe=UTF-8`} 
                        preview={false}
                    />
                </Col>
            </Row>
        </Card>
	)
}

export default StudentReport
