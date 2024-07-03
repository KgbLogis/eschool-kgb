import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Image, Row } from 'antd';
import { STUDENT_MARK_REL, STUDENT_SCHOOL_YEAR } from 'graphql/report';
import { useLazyQuery, useQuery  } from '@apollo/client';
import { REPORT_IMAGE_URL } from 'constants/Url';
import SchoolYearTable from './table';

// const centerStyle = { textAlign: 'center' };

// Дараалалд оруулах функц

function groupByKey(array, key) {
    return array.reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
    }, {})
}

const PrintCard = React.forwardRef(({ data, settings }, ref) => {

    const [printData, setPrintData] = useState([]);

    const [allNumMarkVal, setAllNumMarkVal] = useState([])

    const [schoolYears, setSchoolYears] = useState([]);
    const [schoolyearIndex, setSchoolyearIndex] = useState(0);

    const [totalCredit, setTotalCredit] = useState(0);
    const [totalDiam, setTotalDiam] = useState(0);
    const [numTotalDiam, setNumTotalDiam] = useState(0);

    useEffect(() => {
        setTotalDiam(numTotalDiam / totalCredit)
    }, [totalCredit, numTotalDiam])
    

    const { loading: studentSchoolyearLoading } = useQuery(STUDENT_SCHOOL_YEAR, {
        variables: { student: data.textMid0 },
        onCompleted: data => {
            setSchoolYears(data.studentSchoolyear)
        }
    });

    const [fetchMarkRel] = useLazyQuery(STUDENT_MARK_REL, {
        onCompleted: data => {
            const test = async() => {
                const sortedData = await data.studentMarkRel.map((item) => (
                    {
                        schoolYear: item.mark.markBoard.schoolyear.schoolyear,
                        season: item.mark.markBoard.schoolyear.season,
                        subject: item.mark.markBoard.subject.subject,
                        subjectCode: item.mark.markBoard.subject.subjectCode,
                        credit: item.mark.markBoard.subject.credit,
                        markSetting: item.markSetting.name,
                        markVal: item.markVal
                    }
                ))
                const groupedData = await groupByKey(sortedData, 'subjectCode')
                const calNumMarkVal = Object.keys(await groupedData).map(function eachKey(key) {
                    var per = 0;
    
                    groupedData[key].map((item, idx) => (
                        per = per + Math.floor(groupedData[key][idx].markVal)
                    ))
                    if (allNumMarkVal.includes(per) === false) {
                        setAllNumMarkVal(prevPer => [...prevPer, per])
                    }
                    const markVal = {}

                    groupedData[key].map(function (item, idx) {
                        return (
                            Object.assign(markVal, { [groupedData[key][idx].markSetting]: {
                                    value: Math.floor(groupedData[key][idx].markVal),
                            }})
                        )
                    })
                    return ({
                        schoolYear: groupedData[key][0].schoolYear,
                        season: groupedData[key][0].season,
                        subjectCode: groupedData[key][0].subjectCode,
                        subject: groupedData[key][0].subject,
                        credit: groupedData[key][0].credit,
                        markVal: markVal,
                        numMarkVal: per
                    })
                })
                setSchoolyearIndex(prevndex => prevndex + 1)
                setPrintData(prevData => [...prevData, calNumMarkVal]);
            }
            test();
        }
    });    

    useEffect(() => {
        if (studentSchoolyearLoading === false && schoolYears.length > 0 && schoolYears[schoolyearIndex]) {
            fetchMarkRel({ variables: { student: data.textMid0, schoolyear: schoolYears[schoolyearIndex].id } })
        } 
    }, [data, fetchMarkRel, schoolYears, schoolyearIndex, studentSchoolyearLoading])

    const columns = [
        {
          title: 'Хичээлийн жил',
        },
        {
          title: 'Улирал',
        },
        {
          title: 'Код',
        },
        {
          title: 'Хичээл',
        },
        {
          title: 'Кр',
        },
    ];
    
    settings.map(function (setting) {
        return (
            columns.push(
                {
                    title: setting.name,
                }
            )
        )
    });

    columns.push(
        {
            title: 'Оноо',
        },
        {
            title: 'Дүн',
        },
        {
            title: 'Чанарын голч'
        }
    )

    // if (isLoading) {
    //     return (<Loading cover='content' />)
    // }
    
    return (
        <div ref={ref} >
            <style>
                {
                    "table, th, td {border: 1px solid black }"
                }
            </style>
            <div className="page-break" >
                <Card 
                    style={{ fontFamily: 'Times New Roman', lineHeight: `17px`, color: 'black' }}
                    bordered={false}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={8} className='text-right' >
                            <img
                                style={{ maxHeight: '100px' }}
                                src='/img/logo.png' 
                                alt={data.studentCode}
                            />
                        </Col>
                        <Col span={8} >
                            <div className='text-center' >
                                <b style={{ fontSize: '32px' }} >{data.school}</b>
                                <div className='text-center mt-3' style={{ fontSize: '11px', lineHeight: `10px` }} dangerouslySetInnerHTML={{ __html: data.textTop }} />
                            </div>
                        </Col>
                        <Col span={8} className='text-left'>
                            <img
                                style={{ maxHeight: '100px' }}
                                src={REPORT_IMAGE_URL+data.studentPhoto}
                                alt={data.studentPhoto}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={24} className='text-center' >
                            <b>Дүнгийн мэдээлэл</b>
                            <Row className='mt-4' gutter={[48, 48]} style={{ textAlign: 'start' }}>
                                <Col span={6}>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Эцэг/эхийн нэр</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Өөрийн нэр </p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Регистрийн дугаар</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Суралцагчийн дугаар</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Хичээлийн жил</p>
                                </Col>
                                <Col span={6} >
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid1}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid2}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid3}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.studentCode}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid4}</b></p>
                                </Col>
                                <Col span={6} >
                                    <p style={{ color: 'black', marginBottom: 0 }} >Хөтөлбөрийн индекс</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Хөтөлбөр</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Зэрэг</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Үнэлгээний голч</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Нийт кредит цаг</p>
                                </Col>
                                <Col span={6} >
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid5}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid6}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{data.textMid7}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{totalDiam.toFixed(2)}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{totalCredit}</b></p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider />
                    { printData.map(function(data, index) {
                        return (
                            <SchoolYearTable 
                                key={index} 
                                columns={columns} 
                                credit={{ totalCredit, setTotalCredit }} 
                                settings={settings} 
                                data={data} 
                                setNumTotalDiam={setNumTotalDiam}
                            />
                            // <Row key={index} className="mt-4">
                            //     <Col span={24}>
                            //          <table style={{ width: '100%' }} >
                            //             <thead>
                            //                 <tr >
                            //                     { columns.map((col, index) => (
                            //                         <th  key={index} >{col.title}</th>
                            //                     ))}
                            //                 </tr>
                            //             </thead>
                            //             <tbody>
                            //                 {
                            //                     data.data.map(function (item, index) 
                            //                     {   
                            //                         return (
                            //                             <TableRow key={index} settings={settings} data={item} />
                            //                             // <tr key={index}>
                            //                             //     <td style={centerStyle}>{item.schoolYear}</td>
                            //                             //     <td style={centerStyle}>{item.season}</td>
                            //                             //     <td style={centerStyle}>{item.subjectCode}</td>
                            //                             //     <td>{item.subject}</td>
                            //                             //     <td style={centerStyle}>{Math.floor(item.credit)}</td>
                            //                             //     { settings.map((setting, idx) => (
                            //                             //         <td style={centerStyle} key={idx} >{item.markVal[setting.name]?.value}</td>
                            //                             //     ))}
                            //                             //     <td style={centerStyle}>{item.numMarkVal}</td>
                            //                             //     <td style={{ textAlign: 'center', width: '50px' }}>{item.type}</td>
                            //                             //     <td style={{ textAlign: 'center', width: '100px' }}>{item.diam}</td>
                            //                             // </tr>
                            //                         )
                            //                     })
                            //                 }
                            //             </tbody>
                            //         </table> 
                            //         <div style={{ border: '1px solid black', borderTop: 'none' }}>
                            //             <Row gutter={[8, 8]}>
                            //                 <Col span={8}>
                            //                     <span style={{ marginLeft: '5px' }}> НИЙТ</span> 
                            //                 </Col>
                            //                 <Col span={8} style={{ textAlign: 'center' }}> 
                            //                     <span>Кредит: {data.yearTotalCredit}</span> 
                            //                 </Col>
                            //                 <Col span={8} style={{ textAlign: 'end' }} > 
                            //                     <span style={{ marginRight: '5px' }}>Үн.Голч: {data.yearTotalDiam.toFixed(2)}</span> 
                            //                 </Col>
                            //             </Row>
                            //         </div>
                            //     </Col>
                            // </Row>
                        )
                    })}
                    <Row gutter={[16, 16]} className='mt-4'>
                        <Col span={24}>
                            <div dangerouslySetInnerHTML={{ __html: data.textBottom }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className='text-center'>
                            <Image 
                                src={`https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=http%3A%2F%2F${window.location.hostname}%2Fstudent-mark-report%2F${data.studentCode}&chld=H&choe=UTF-8`} 
                                preview={false}
                            />
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    )
});

export default PrintCard