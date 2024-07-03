import React from 'react';
import { Transfer, Table, Card, Tag } from 'antd';
import difference from 'lodash/difference';

const tableColumns = [
    {
        dataIndex: 'title',
        title: 'Нэр',
        render: (text, record) => (
            <Tag color={record.color} >{text}</Tag>
        ),
    },
];

const TableTransfer = ({ loading, ...restProps }) => (
    <Transfer
        {...restProps} 
        showSelectAll={false}
    >
        {({
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
        }) => {
            const columns = tableColumns;

            const rowSelection = {
                getCheckboxProps: item => ({ disabled: item.disabled }),
                onSelectAll(selected, selectedRows) {
                    const treeSelectedKeys = selectedRows
                        .filter(item => !item.disabled)
                        .map(({ key }) => key);
                    const diffKeys = selected
                        ? difference(treeSelectedKeys, listSelectedKeys)
                        : difference(listSelectedKeys, treeSelectedKeys);
                    onItemSelectAll(diffKeys, selected);
                },
                onSelect({ key }, selected) {
                    onItemSelect(key, selected);
                },
                selectedRowKeys: listSelectedKeys,
            };

            return (
                <Table
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredItems}
                    size="small"
                    style={{ pointerEvents: null }}
                    onRow={({ key, disabled: itemDisabled }) => ({
                        onClick: () => {
                        if (itemDisabled) return;
                            onItemSelect(key, !listSelectedKeys.includes(key));
                        },
                    })}
                />
            );
        }}
    </Transfer>
);

const TransferCard = ({ data, permissions, loading, updateData }) => {

    const targetKeys = data.permissions.map((selected) => (
        selected.codename
    ))

    const onChange = (targetKeys, direction, moveKeys) => {
        const action = direction === 'left' ? false : true
        moveKeys.map((codename) => (
            updateData({ variables: { action: action, codename: codename, id: data.id } })
        ))
    };

    return (
        <Card
            title={data.name}
        >
            <TableTransfer
                loading={loading}
                dataSource={permissions}
                targetKeys={targetKeys}
                showSearch={true}
                onChange={onChange}
                filterOption={(inputValue, item) =>
                    item.title.toLowerCase().indexOf(inputValue) !== -1
                }
            />
        </Card>
    );
}

export default TransferCard;