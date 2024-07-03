import React from 'react';
import { message, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_ROUTINE_STUDENT } from 'graphql/create';
import StudentSelect from 'components/shared-components/StudentSelect';

function MarkBoardForm ({boardData, setStudentModalVisible}) {

    const [create, { loading: createLoading }] = useMutation(CREATE_ROUTINE_STUDENT, {
		onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setStudentModalVisible(false);
		}
	});
    
    return (
        <Spin spinning={createLoading} tip="Ачааллаж байна...">
            <StudentSelect 
                submitData={create}
                loading={createLoading}
                mutationData={{ routine: boardData.id }}
            />
        </Spin>
    );
};

export default MarkBoardForm