import React, { useEffect, useState } from "react";
import Table from './table';
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GROUP_PERMISSION, PERMISSIONS, UPDATE_TEACHER_PERMISSION, USER_PERMISSION } from "graphql/role";
import { Checkbox, message } from "antd";
import { useLocation } from "react-router-dom";

const Index = (props) => {
    
    const location = useLocation(); 

    const [list, setList] = useState([]);
    const [groupPer, setGroupPer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userPer, setUserPer] = useState([]);

    const { loading: permissionsLoading } = useQuery(PERMISSIONS, {
        onCompleted: data => {
            setList(data.permissions)
        }
    })

    const [fetchGroup, { loading: groupPerLoading }] = useLazyQuery(GROUP_PERMISSION, {
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setGroupPer(data.groupPermissions)
        }
    })

    const [fetchUserPer, { loading: userLoading, refetch: userRefetch }] = useLazyQuery(USER_PERMISSION, {
        onError: error => {
            setLoading(false);
        },
        fetchPolicy: 'network-only',
        onCompleted: data => {
            setUserPer(data.customUserPermissions)
        }

    })

    const [update, { loading: updateLoading }] = useMutation(UPDATE_TEACHER_PERMISSION, {
        onCompleted: data => {
            userRefetch();
            message.success('Амжилттай хадгаллаа');
        }
    })

    useEffect(() => {
        if (location.state) {
            fetchGroup({ variables: { userId: location.state.user } })
            fetchUserPer({ variables: { userId: location.state.user } });
        }
    }, [fetchGroup, fetchUserPer, location.state])

    useEffect(() => {
        if (permissionsLoading || groupPerLoading || updateLoading || userLoading) {
            setLoading(true);
        }
        if (!permissionsLoading && !groupPerLoading && !updateLoading && !userLoading) {
            setLoading(false);
        }
    }, [permissionsLoading, groupPerLoading, updateLoading, userLoading])

    const columns = [
        {
            key: 'name',
            title: 'Нэр',
            dataIndex: 'name',
        },
        {
            key: 'add',
            title: 'Нэмэх',
            dataIndex: 'add',
            render: (_, elm) => (
                elm.add && (
                    <Checkbox 
                        onChange={e => onChange(e, `add_${elm.codeName}`)} 
                        checked={checkPermission(`add_${elm.codeName}`).isChecked} 
                        disabled={checkPermission(`add_${elm.codeName}`).isDisabled} 
                    />
                )
            )
        },
        {
            key: 'change',
            title: 'Засах',
            dataIndex: 'change',
            render: (_, elm) => (
                elm.change && (
                    <Checkbox 
                        onChange={e => onChange(e, `change_${elm.codeName}`)} 
                        checked={checkPermission(`change_${elm.codeName}`).isChecked} 
                        disabled={checkPermission(`change_${elm.codeName}`).isDisabled} 
                    />
                )
            )
        },
        {
            key: 'delete',
            title: 'Устгах',
            dataIndex: 'delete',
            render: (_, elm) => (
                elm.delete && (
                    <Checkbox 
                        onChange={e => onChange(e, `delete_${elm.codeName}`)} 
                        checked={checkPermission(`delete_${elm.codeName}`).isChecked} 
                        disabled={checkPermission(`delete_${elm.codeName}`).isDisabled} 
                    />
                )
            )
        },
        {
            key: 'view',
            title: 'Харах',
            dataIndex: 'view',
            render: (_, elm) => (
                elm.view && (
                    <Checkbox 
                        onChange={e => onChange(e, `view_${elm.codeName}`)} 
                        checked={checkPermission(`view_${elm.codeName}`).isChecked} 
                        disabled={checkPermission(`view_${elm.codeName}`).isDisabled} 
                    />
                )
            )
        },
    ]

    const onChange = (e, codename) => {
        update({ variables: { action: e.target.checked, codename: codename, teacherCode: location.state.teacherCode } });
    }

    const checkPermission = (codename) => {
        const isDisabled = groupPer.some(function(el) {
            return el.codename === codename;
        })
        const isChecked = userPer.some(function(el) {
            return el.codename === codename;
        });
        return (
            {
                isDisabled: isDisabled,
                isChecked: isDisabled ? isDisabled : isChecked
            }
        )
    }
    
    if (!location.state) {
        return null
    }

    return (
        <Table 
            list={list} 
            columns={columns} 
            loading={loading}
        />
    )
}

export default Index;