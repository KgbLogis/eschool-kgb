import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { ALL_MENUS } from 'graphql/core';
import { svg } from 'configs/MenuIcon';

export function useMenu () {

    const { data, loading, refetch } = useQuery(ALL_MENUS);
    const [mainNavTree, setMainNavTree] = useState([]);
  
    useEffect(() => {
        let treeData = [];
        let subTreeData = []
        const setMenus = () => {
            data.allMenus.map(function(first) {

                if (first.key === `configs`) {
                    // eslint-disable-next-line no-useless-escape
                    const firstData = first.subMenu.split('\\\"fields\\\":')
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
                            path: secondData[1].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            // eslint-disable-next-line no-useless-escape
                            title: secondData[2].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            icon: subicon?.svg,
                            breadcrumb: true,
                            submenu : []
                        })
                    });
                    return (treeData.push({
                        key: first.key,
                        path: `${APP_PREFIX_PATH}/` + first.path,
                        title: first.title,
                        icon: first.icon,
                        priority: first.priority,
                        breadcrumb: false,
                        submenu: [
                            {
                                key: first.key,
                                path: `${APP_PREFIX_PATH}/` + first.path,
                                title: first.title,
                                icon: first.icon,
                                id: first.id,
                                breadcrumb: true,
                                submenu: subTreeData
                            }
                        ]
                    }) )
                  } else {
                    // eslint-disable-next-line no-useless-escape
                    const firstData = first.subMenu.split('\\\"fields\\\":')
                    subTreeData = [];
                    firstData.splice('index', 1);
                    firstData.map(function (second) {
                        const secondData = second.split(',')
                        // eslint-disable-next-line no-useless-escape
                        return subTreeData.push({
                            // eslint-disable-next-line no-useless-escape
                            key: secondData[0].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            // eslint-disable-next-line no-useless-escape
                            path: `${APP_PREFIX_PATH}/` + secondData[1].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            // eslint-disable-next-line no-useless-escape
                            title: secondData[2].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            icon: secondData[3].split(':')[1].match(/\"([^']+)\\\"/)[1],
                            breadcrumb: true,
                            submenu : []
                        })
                    });
    
                    return treeData.push({
                        key: first.key,
                        path: `${APP_PREFIX_PATH}/` + first.path,
                        title: first.title,
                        icon: first.icon,
                        priority: first.priority,
                        breadcrumb: first.breadcrumb,
                        submenu: subTreeData
                    })
                  }
                
            });
            setMainNavTree(treeData.sort(function(a, b){return a.priority - b.priority}));
        }
        if(loading === false && data) {
            setMenus();
        }
    }, [data, loading])

    return {
        mainNavTree: mainNavTree,
        menuRefetch: refetch
    }

}