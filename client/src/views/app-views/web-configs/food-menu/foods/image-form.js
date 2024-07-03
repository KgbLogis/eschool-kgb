import React from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Button, Image, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { ALL_FOOD_FILES_BYFOOD, CREATE_FOOD_FILE } from 'graphql/food'
import IntlMessage from 'components/util-components/IntlMessage';
import { BASE_SERVER_URL } from 'configs/AppConfig';

const ImageForm = ({ editData }) => {

    const { data, refetch } = useQuery(ALL_FOOD_FILES_BYFOOD, {
        variables: { food: editData.id }
    })

    const [upload, { loading: uploadLoading }] = useMutation(CREATE_FOOD_FILE, {
        onCompleted: data => {
            refetch();
            message.success(`Амжилттай хууллаа`);
		}
    });
    
    async function fileUploading (value) {
        await upload({ variables: { image: value.file, food: editData.id } });
        value.onSuccess("Ok");
    };

    return (
        <>
            <Upload 
                multiple={true}
                accept=".jpg, .png"
                orientation="right"
                customRequest={fileUploading}
                showUploadList={false}
            >
                <Button 
                    style={{float: 'right'}} 
                    size='small' 
                    type="primary" 
                    icon={<UploadOutlined />} 
                    loading={uploadLoading} 
                > <IntlMessage id="main.upload-file" /> </Button>
            </Upload>
            <div className='mt-4 grid grid-cols-4 gap-4'>
                { data?.allFoodFilesByFood.map((item, index) => (
                    <div className='mx-auto' key={index}>
                        <Image 
                            className="w-auto h-120" 
                            src={`${BASE_SERVER_URL}${item.image}`}
                            alt="image description" 
                        />
                    </div>
                ))}
            </div>
        </>
    )
}

export default ImageForm