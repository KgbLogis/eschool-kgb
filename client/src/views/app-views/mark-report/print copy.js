import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Image, Row, Avatar } from 'antd';
import { STUDENT_MARK_REL, STUDENT_SCHOOL_YEAR, MARK_PERCENTAGE } from 'graphql/report';
import { useLazyQuery, useQuery  } from '@apollo/client';
import Loading from 'components/shared-components/Loading';

const centerStyle = { textAlign: 'center' };

const PrintCard = React.forwardRef((props, ref) => {
    
    const [fetchedMarkRel, setFetchdMarkRel] = useState([]);
    const [array1, setArray1] = useState([]);
    const [array2, setArray2] = useState([]);
    const [marks, setMarks] = useState([]);
    const [markPercentages] = useState([]);
    const [allPercentages] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const [datas] = useState([]);
    const [yearIndex, setYearIndex] = useState(0);
    const [perIndex, setPerIndex] = useState(0);

    const [totalCredit, setTotalCredit] = useState(0);
    const [totalDiam, setTotalDiam] = useState(0);

    const { data: schoolYears } = useQuery(STUDENT_SCHOOL_YEAR, {
        variables: { student: props.data.textMid0 }
    });

    const [fetchMarkPercentage] = useLazyQuery(MARK_PERCENTAGE, {
        onCompleted: result => {
            markPercentages.push({
                data:result.markPercentage
            });
            setPerIndex(prevPerIndex => prevPerIndex + 1);
        }
    })

    const [fetchMarkRel, { networkStatus }] = useLazyQuery(STUDENT_MARK_REL, {
        onCompleted: result => {
            datas.push({
                data: result.studentMarkRel
            })
            setYearIndex(prevYearIndex => prevYearIndex + 1);
        }
    });

    // Дараалалд оруулах функц
    
    function groupByKey(array, key) {
        return array.reduce((hash, obj) => {
            if(obj[key] === undefined) return hash; 
            return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
    }    

    // Ирсэн датаг дараалалд оруулах

    useEffect(() => {
    
        const startFetchMarkRel = (index) => {
            fetchMarkRel({variables: { student: props.data.textMid0, schoolyear: schoolYears.studentSchoolyear[index].id }});
        }    

        var result = [];
    
        if (isLoading === false) {
            setArray1(result);
        }

        if (networkStatus === 7) {
            fetchedMarkRel.map(function (data, index) {
                const aaas = data.data.map(function(as) {
                    return {
                        schoolYear: as.mark.markBoard.schoolyear.schoolyear,
                        season: as.mark.markBoard.schoolyear.season,
                        subject: as.mark.markBoard.subject.subject,
                        subjectCode: as.mark.markBoard.subject.subjectCode,
                        credit: as.mark.markBoard.subject.credit,
                        markSetting: as.markSetting.name,
                        markVal: as.markVal
                    }
                });
                if(index === fetchedMarkRel.length -1) {
                    setIsloading(false)
                }
                return result.push(groupByKey(aaas, 'subjectCode'));
            })
        }
        
        if (schoolYears && schoolYears.studentSchoolyear[yearIndex]) {
            startFetchMarkRel(yearIndex);
            setFetchdMarkRel(datas);
        }
        
    }, [isLoading, fetchedMarkRel, networkStatus, schoolYears, yearIndex, datas, fetchMarkRel, props.data.textMid0]);

    // Дараалалд орсон датаг нэгтгэх

    useEffect(() => {

        const startFetchMarkPercentage = (value) => {
            fetchMarkPercentage({ variables: { percentage: value } })
        }

        const handleMarks = () => {

            const groupedData = []
            
            array1.map(function(data) {

                const array1 = Object.keys(data).map(function eachKey(key) {
                    let per = 0;

                    data[key].map((item, idx) => (
                        per = per + Math.floor(data[key][idx].markVal)
                    ))

                    allPercentages.push(per)
                    
                    return ({
                        schoolYear: data[key][0].schoolYear,
                        season: data[key][0].season,
                        subjectCode: data[key][0].subjectCode,
                        subject: data[key][0].subject,
                        credit: data[key][0].credit,
                        markVal: data[key].map(function (item, idx) {
                            return Math.floor(data[key][idx].markVal)
                        }),
                        numMarkVal: per
                    })
                })
            
                return groupedData.push(array1)
            })
            
            setArray2(groupedData);
        }
        
        if (array1.length > 0 && networkStatus === 7) {
            handleMarks();
        }
        
        if (allPercentages.length > 0 && allPercentages[perIndex]) {
            startFetchMarkPercentage(allPercentages[perIndex]);

        }
        
    }, [array1, networkStatus, allPercentages, fetchMarkPercentage, perIndex]);

    useEffect(() => {

        const findByValuee = (value) => {
            const found = markPercentages.find(function(obj) {
                return obj.data.percentage === value
            })
    
            return found
        }

        const withTypeDiam = []

        let totCre = 0
        let numDiam = 0
        let totDiam = 0

        array2.map(function(data, index) {

            let yearTotalCredit = 0;
            let yearTotalDiam = 0;
            let numTotalDiam = 0;
            
            const gg = data.map(function (item, index) 
            {
                const found = findByValuee(item.numMarkVal)
                yearTotalCredit = Math.floor(yearTotalCredit) + Math.floor(item.credit)
                numTotalDiam = numTotalDiam + (found?.data.diam * Math.floor(item.credit))
                yearTotalDiam = numTotalDiam / yearTotalCredit
                return (
                    {
                        schoolYear: item.schoolYear,
                        season: item.season,
                        subject: item.subject,
                        subjectCode: item.subjectCode,
                        credit: item.credit,
                        markVal: item.markVal,
                        numMarkVal: item.numMarkVal,
                        type: found?.data.type,
                        diam: found?.data.diam
                    }
                )
            })

            totCre = Math.floor(totCre) + Math.floor(yearTotalCredit)
            numDiam = numDiam + (yearTotalDiam * Math.floor(yearTotalCredit))
            totDiam = numDiam / totCre

            return withTypeDiam.push({
                data: gg, 
                yearTotalCredit: yearTotalCredit, 
                yearTotalDiam: yearTotalDiam
            });
        })

        setTotalCredit(totCre)
        setTotalDiam(totDiam.toFixed(2))

        setMarks(withTypeDiam);

    }, [markPercentages, array2])

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
    
    props.settings.map(function (setting) {
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

    if (isLoading) {
        return (<Loading cover='content' />)
    }
    
    return (
        <div ref={ref} >
            <style>
                {"table, th, td{border: 1px solid black }"}
            </style>
            <div className="page-break" >
                <Card 
                    style={{ fontFamily: 'Times New Roman', lineHeight: `17px`, color: 'black' }}
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
                                <b style={{ fontSize: '32px' }} >{props.data.school}</b>
                                <div className='text-center mt-3' style={{ fontSize: '11px', lineHeight: `10px` }} dangerouslySetInnerHTML={{ __html: props.data.textTop }} />
                            </div>
                        </Col>
                        <Col span={8} className='text-left'>
                            <Avatar
                                size={100}
                                src={`http://192.168.1.6:8000`+props.data.studentPhoto}
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
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid1}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid2}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid3}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.studentCode}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid4}</b></p>
                                </Col>
                                <Col span={6} >
                                    <p style={{ color: 'black', marginBottom: 0 }} >Хөтөлбөрийн индекс</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Хөтөлбөр</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Зэрэг</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Үнэлгээний голч</p>
                                    <p style={{ color: 'black', marginBottom: 0 }} >Нийт кредит цаг</p>
                                </Col>
                                <Col span={6} >
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid5}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid6}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{props.data.textMid7}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{totalDiam}</b></p>
                                    <p style={{ color: 'black', marginBottom: 0 }}><b>{totalCredit}</b></p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider />
                    { marks.map(function(data, index) {
                        return (
                            <Row key={index} className="mt-4">
                                <Col span={24}>
                                     <table style={{ width: '100%' }} >
                                        <thead>
                                            <tr >
                                                { columns.map((col, index) => (
                                                    <th  key={index} >{col.title}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                data.data.map(function (item, index) 
                                                {   
                                                    return (
                                                        <tr key={index}>
                                                            <td style={centerStyle}>{item.schoolYear}</td>
                                                            <td style={centerStyle}>{item.season}</td>
                                                            <td style={centerStyle}>{item.subjectCode}</td>
                                                            <td>{item.subject}</td>
                                                            <td style={centerStyle}>{Math.floor(item.credit)}</td>
                                                            { item.markVal.map((item, idx) => (
                                                                <td style={centerStyle} key={idx} >{item}</td>
                                                            ))}
                                                            <td style={centerStyle}>{item.numMarkVal}</td>
                                                            <td style={{ textAlign: 'center', width: '50px' }}>{item.type}</td>
                                                            <td style={{ textAlign: 'center', width: '100px' }}>{item.diam}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table> 
                                    <div style={{ border: '1px solid black', borderTop: 'none' }}>
                                        <Row gutter={[8, 8]}>
                                            <Col span={8}>
                                                <span style={{ marginLeft: '5px' }}> НИЙТ</span> 
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'center' }}> 
                                                <span>Кредит: {data.yearTotalCredit}</span> 
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'end' }} > 
                                                <span style={{ marginRight: '5px' }}>Үн.Голч: {data.yearTotalDiam.toFixed(2)}</span> 
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        )
                    })}
                    <Row gutter={[16, 16]} className='mt-4'>
                        <Col span={24}>
                            <div dangerouslySetInnerHTML={{ __html: props.data.textBottom }} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className='text-center'>
                            <Image 
                                src={`https://chart.googleapis.com/chart?chs=177x177&cht=qr&chl=http%3A%2F%2F${window.location.hostname}%2Fstudent-mark-report%2F${props.data.studentCode}&chld=H&choe=UTF-8`} 
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