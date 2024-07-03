import React, { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { ALL_GROUPS, PERMISSIONS, UPDATE_GROUP_PERMISSION } from "graphql/role";
import TransferCard from './transfer';
import { Tag } from "antd";

const Index = () => {

    const [groups, setGroups] = useState([]);
    const [permissions, setPermissions] = useState([])
    const [isLoading, setIsLoading] = useState(true);

    const { loading: groupLoading, refetch } = useQuery(ALL_GROUPS, {
        onCompleted: data => {
            setGroups(data.allGroups);
            fetchPermissions();
        }
    })

    const [fetchPermissions, { loading: permissionLoading }] = useLazyQuery(PERMISSIONS, {
        onCompleted: data => {
            const filterData = data.permissions.flatMap(function(permission) {
                
                const children = []
                
                permission.add && children.push({ 
                    key: `add_${permission.codeName}`, 
                    title: `${permission.name} нэмэх`,
                    color: 'green'
                })
                permission.change && children.push({ 
                    key: `change_${permission.codeName}`, 
                    title: `${permission.name} засах`,
                    color: 'orange'
                })
                permission.view && children.push({ 
                    key: `view_${permission.codeName}`, 
                    title: `${permission.name} харах`,
                    color: 'geekblue'
                })
                permission.delete && children.push({ 
                    key: `delete_${permission.codeName}`, 
                    title: `${permission.name} устгах`,
                    color: 'magenta'
                })
                
                return children
            })
            setPermissions(filterData);
        }
    })

    const [update, { loading: updateLoading}] = useMutation(UPDATE_GROUP_PERMISSION, {
        onCompleted: data => {
            refetch();
        }
    })

    useEffect(() => {
        if (groupLoading || permissionLoading || updateLoading) {
            setIsLoading(true);
        }
        if (!groupLoading && !permissionLoading && !updateLoading) {
            setIsLoading(false);
        }
    }, [groupLoading, permissionLoading, updateLoading])
    

    return (
        <>
            <div className="mb-4">
                <Tag color="green">Нэмэх эрх</Tag>
                <Tag color="orange">Засах эрх</Tag>
                <Tag color="geekblue">Харах эрх</Tag>
                <Tag color="magenta">Устгах эрх</Tag>
            </div>
            { groups.map((item, index) => (
                <TransferCard 
                    updateData={update}
                    loading={isLoading}
                    data={item}
                    key={index}
                    permissions={permissions}
                />
            ))}
        </>
    )
}

export default Index;
