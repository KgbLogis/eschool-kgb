import { Button } from 'antd'
import IntlMessage from 'components/util-components/IntlMessage'
import { LockTwoTone } from '@ant-design/icons';
import React, { useRef } from 'react'
import FormModal from '../FormModal';
import PasswordForm from './form';

const ChangePassword = ({ user }) => {

    const modalRef = useRef();
    
    function handleCancel() {
        modalRef.current.handleCancel()
    }

    function handleOpen() {
        modalRef.current.handleOpen()
    }

    return (
        <>
            <FormModal ref={modalRef}>
                <PasswordForm closeModal={handleCancel} user={user} />
            </FormModal>
            <Button
                onClick={() => handleOpen()}
                size='small'
                type='text'
                icon={<LockTwoTone />} 
            > <IntlMessage id="change_password" />
            </Button>
        </>
    )
}

export default ChangePassword