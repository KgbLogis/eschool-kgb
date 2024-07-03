import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd';

const FormModal = forwardRef(({ children, title, footer, formName = 'form', forceRender = false }, ref) => {
    
    const [isModalVisible, setIsModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        handleOpen() {
            setIsModalVisible(true);
        },
        handleCancel () {
            setIsModalVisible(false);
        }
    }));
    
    return (
        <Modal 
            width={1000}
            title={title} 
            visible={isModalVisible}
            onCancel={ref.current?.handleCancel}
            okText="Хадгалах"
            footer={footer}
            cancelText="Болих"
            forceRender={forceRender}
            okButtonProps={{form:formName, key: 'submit', htmlType: 'submit'}}
        >
            {children}
        </Modal>
    )
});

export default FormModal;
