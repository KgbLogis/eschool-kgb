import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { ALL_MENUS } from 'graphql/core';
import { svg } from 'configs/MenuIcon';

export function GetData () {

    const { data, loading } = useQuery(ALL_MENUS);
    const [mainNavTree, setMainNavTree] = useState([]);
  
    useEffect(() => {
        let treeData = [];
        let subTreeData = []
        const setMenus = () => {
            data.allMenus.map(function(first) {
                // eslint-disable-next-line no-useless-escape
                const firstData = first.subMenu.split('\\\"fields\\\":')
                const icon = svg.find(({name}) => name === first.icon);
                subTreeData = [];
                firstData.splice('index', 1);
                firstData.map(function (second) {
                    const secondData = second.split(',')
                    // eslint-disable-next-line no-useless-escape
                    const subicon = svg.find(({name}) => name === secondData[3].split(':')[1].match(/\"([^']+)\\\"/)[1]);
                    return subTreeData.push({
                        // eslint-disable-next-line no-useless-escape
                        key: secondData[0].split(':')[1].match(/\"([^']+)\\\"/)[1],
                        // eslint-disable-next-line no-useless-escape
                        path: `${APP_PREFIX_PATH}/` + secondData[1].split(':')[1].match(/\"([^']+)\\\"/)[1],
                        // eslint-disable-next-line no-useless-escape
                        title: secondData[2].split(':')[1].match(/\"([^']+)\\\"/)[1],
                        icon: subicon,
                        breadcrumb: true,
                        submenu : []
                    })
                });

                return treeData.push({
                    key: first.key,
                    path: `${APP_PREFIX_PATH}/` + first.path,
                    title: first.path,
                    icon: icon,
                    breadcrumb: true,
                    submenu: subTreeData
                })
            });
            setMainNavTree(treeData);
        }
        if(loading === false && data) {
            setMenus();
        }
    }, [data, loading])

    return mainNavTree

}