import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { Button, Card, Image, message, Steps, Typography } from 'antd';
import { CHECK_INVOICE_STATUS, CREATE_INVOICE, INVOICE_BY_STUDENT } from 'graphql/payment';

const { Step } = Steps;
const { Title, Paragraph } = Typography;

const Sanamj = () => {
    return (
        <Typography className='mt-4'>
            <Title>Санамж</Title>
            <Paragraph>
            - Хэрэглэгч манай хамтран ажиллаж буй банкны системүүдийг ашиглан өөрийн төлбөрийн
            картын дугаараар шууд худалдаа хийх боломжтой. <br/>
            - Дансаар төлөх тохиолдолд та манай Хаан, ХХБ, Голомт, Хас, Төрийн банк дахь дансанд
            зааврыг дагуу шилжүүлэх боломжтой ба шилжүүлсний дараа вэб чатаар болон утсаар
            холбогдон мэдэгдэх шаардлагатай. <br/>
            - Цахилгаан, интернет, сүлжээний доголдол, хэрэглэгчийн буруутай үйл ажиллагаанаас
            төлбөртэй холбоотой асуудал үүссэн тохиолдолд байгууллага хариуцахгүй
            </Paragraph>
        </Typography>
    )
}

const Qpay = ({ invoice }) => {

    return (
        <div className='text-center mt-4'>
            <Typography>
                <Title level={4}>Гүйлгээний төлөв (Хүлээгдэж байна)</Title>
                <Paragraph>
                    Та энэхүү QR кодыг банкны апликэйшнаар уншуулан төлөөрэй Social pay-ээр уншуулах боломжгүй.
                </Paragraph>
            </Typography>
            <Image
                width={300}
                preview={false}
                src={`data:image/png;base64, ${invoice.qpayQrImage}`}
            />
        </div>
    )
}

const Index = () => {

    const [invoice, setInvoice] = useState();
    const [current, setCurrent] = useState(0);

    const [createInvoice, { loading }] = useMutation(CREATE_INVOICE, {
        onCompleted: data => {
            refetchInvoice()
        }
    })

    const steps = [
        {
          title: 'Эхлэл',
          content: <Sanamj />,
        },
        {
          title: 'Төлбөр',
          content: <Qpay invoice={invoice} />,
        },
        {
          title: 'Дуусгах',
          content: 'Last-content',
        },
    ];

    const { refetch: refetchInvoice } = useQuery(INVOICE_BY_STUDENT, {
        onCompleted: data => {
            setInvoice(data.invoiceByStudent);
            if (data.invoiceByStudent === null) {
                createInvoice()
            }
        }
    })
    
    useQuery(CHECK_INVOICE_STATUS, {
        pollInterval: 10000,
        variables: { id: invoice? invoice.id : 1 },
        onCompleted: data => {
            if (data.checkInvoiceStatus === 'PENDING') {
                message.warning('Төлбөр төлөгдөөгүй байна!')
            } else {
                setCurrent(current + 1);
            }
        }
    })

    const next = () => {
        setCurrent(current + 1);
      };
    
    const prev = () => {
        setCurrent(current - 1);
    };

    return (
        <Card>
            <Steps current={current}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">{steps[current].content}</div>
            <div className="steps-action text-center mt-4">
                {current === 0 && (
                    <Button type="primary" onClick={() => next()}>
                        Дараах
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                        Дуусгах
                    </Button>
                )}
            </div>
        </Card>
    )
}

export default Index