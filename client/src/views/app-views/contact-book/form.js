import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Switch, Form, Input, InputNumber, message, Row, Select, Spin, Upload, Empty, Pagination } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import IntlMessage from 'components/util-components/IntlMessage';
import { ALL_CONTACT_BOOKS, CREATE_CONTACT_BOOK, UPDATE_CONTACT_BOOK } from 'graphql/contact-book';
import { SELECT_STUDENT_PAGINATION } from 'graphql/select';
import Loading from 'components/shared-components/Loading';
import { BASE_SERVER_URL } from 'configs/AppConfig';
import { ImageSvg } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon';
import { debounce } from 'lodash';

const { Option } = Select
const { Dragger } = Upload;

function SchoolForm({ editData, formType, setIsModalVisible }) {

    const [form] = Form.useForm();

    const [selectedImage, setSelectedImage] = useState()

    const [studentFilter, setStudentFilter] = useState("");
    const [studentPage, setStudentPage] = useState(1)

    const imageProps = {
        accept: '.jpg',
        name: 'file',
        multiple: false,
        listType: "picture-card",
        showUploadList: false,
        beforeUpload: file => {
            return false
        }
    };

    const [createSchool, { loading: createLoading }] = useMutation(CREATE_CONTACT_BOOK, {
        refetchQueries: [ALL_CONTACT_BOOKS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    });

    const [updateSchool, { loading: updateLoading }] = useMutation(UPDATE_CONTACT_BOOK, {
        refetchQueries: [ALL_CONTACT_BOOKS],
        onCompleted: data => {
            message.success('Амжилттай хадгаллаа');
            setIsModalVisible(false);
        }
    })

    const { data: studentData, loading: studentsLoading } = useQuery(SELECT_STUDENT_PAGINATION, {
        variables: {
            filter: studentFilter,
            page: studentPage,
            perPage: 30
        }
    })

    useEffect(() => {
        if (formType === "edit") {
            form.setFieldsValue({
                physicalCondition: editData.physicalCondition,
                isSleep: editData.isSleep,
                isMorningFoodEat: editData.isMorningFoodEat,
                defecateCount: editData.defecateCount,
                wordToSay: editData.wordToSay,
                student: editData.student.id,
            });
        } else if (formType === "create") {
            form.resetFields();
        }
    }, [editData, form, formType]);

    const debouncedSetStudentFilter = useMemo(
        () =>
            debounce(filter => {
                setStudentFilter(filter)
            }, 500),
        [setStudentFilter]
    )

    const onStudentSearch = useCallback(
        value => {
            debouncedSetStudentFilter(value)
        },
        [debouncedSetStudentFilter]
    )

    const onImageChange = (file) => {
        if (file) {
            setSelectedImage(file.file)
        }
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const onFinish = values => {
        if (values.file) {
            const lastIndexOfFiles = values.file.pop()
            values.file = lastIndexOfFiles.originFileObj
        } else {
            values.file = ""
        }
        if (formType === "edit") {
            values.id = editData?.id
            updateSchool({ variables: values })
        } else {
            createSchool({ variables: values })
        }
    };

    return (
        <Spin spinning={createLoading || updateLoading} tip="Ачааллаж байна...">
            <Form
                id="ContactBookForm"
                layout={'vertical'}
                form={form}
                name="school"
                onFinish={onFinish}
            >
                <Row gutter={[16, 24]}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="student" label={<IntlMessage id="student" />} rules={[
                            {
                                required: true,
                                message: "Хоосон орхих боломжгүй"
                            }
                        ]}>
                            <Select
                                showSearch
                                filterOption={false}
                                notFoundContent={
                                    studentsLoading ? <Loading cover='content' />
                                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                onSearch={onStudentSearch}
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Pagination
                                            className='my-2 flex justify-center'
                                            defaultCurrent={studentPage}
                                            total={studentData?.allStudentsPagination.totalCount}
                                            onChange={pageIndex => setStudentPage(pageIndex)}
                                            showSizeChanger={false}
                                        />
                                    </>
                                )}
                            >
                                {studentData?.allStudentsPagination.records.map((item, index) => (
                                    <Option value={item.id} key={index} > {item.familyName} {item.name} </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="isSleep" label={<IntlMessage id="isSleep" />} valuePropName="checked" rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Switch checkedChildren="Утсан" unCheckedChildren="Унтаагүй" />
                        </Form.Item>
                        <Form.Item name="physicalCondition" label={<IntlMessage id="physicalCondition" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="file"
                            label={<IntlMessage id="file" />}
                            valuePropName='fileList'
                            getValueFromEvent={normFile}
                        >
                            <Dragger
                                {...imageProps}
                                onChange={e => onImageChange(e)}
                            >
                                {selectedImage ?
                                    <img src={URL.createObjectURL(selectedImage)} alt="avatar" className="img-fluid max-h-40" />
                                    :
                                    <div>
                                        {editData?.file ?
                                            <img src={BASE_SERVER_URL + editData?.file} alt="avatar" className="img-fluid max-h-40" />
                                            :
                                            <div>
                                                <CustomIcon className="display-3" svg={ImageSvg} />
                                                <p>Файлыг байршуулахын тулд товшиж эсвэл чирнэ үү</p>
                                            </div>
                                        }
                                    </div>
                                }
                            </Dragger>
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item name="defecateCount" label={<IntlMessage id="defecateCount" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <InputNumber className='w-full' />
                        </Form.Item>
                        <Form.Item name="isMorningFoodEat" label={<IntlMessage id="isMorningFoodEat" />} valuePropName="checked" rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Switch checkedChildren="Уусан" unCheckedChildren="Уугаагүй" />
                        </Form.Item>
                        <Form.Item name="wordToSay" label={<IntlMessage id="wordToSay" />} rules={[
                            {
                                required: true,
                                message: <IntlMessage id="form.required" />
                            },
                        ]}>
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Spin>
    );
};

export default SchoolForm