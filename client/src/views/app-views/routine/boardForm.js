import React from 'react';
import { Form, message, Spin, DatePicker } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_MARK_BOARD_FROM_ROUTINE } from 'graphql/mark';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import IntlMessage from 'components/util-components/IntlMessage';

function MarkBoardForm ({boardData, setBoardModalVisible}) {

    const [form] = Form.useForm();
    const { RangePicker } = DatePicker;

	let history = useHistory();

    const [createMarkBoard, { loading: createLoading }] = useMutation(CREATE_MARK_BOARD_FROM_ROUTINE, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setBoardModalVisible(false);
			history.push('/app/mark-board')
		}
	});

    

    const onFinish = values => {
        values.dates.map(function (date, index) {
            if (index === 0) {
                values.startAt = moment(date).format("YYYY-MM-DD")
            } else {
                values.endAt = moment(date).format("YYYY-MM-DD") 
            }
            return null
        })

        if (values.hasOwnProperty('endAt')) {
            values.routine = boardData.id;
            values.status = 'OPEN';
            createMarkBoard({ variables: values});
        }
    };

    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <Form  
                id="MarkBoardForm"
                                layout={'vertical'}
                form={form}
                name="control-hooks" 
                onFinish={onFinish}
            >
                <Form.Item name="dates" label={<IntlMessage id="start_end_date" />} rules={[
                    { 
                        required: true,
                        message: "Хоосон орхих боломжгүй"
                    }
                ]}>
                    <RangePicker/>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default MarkBoardForm