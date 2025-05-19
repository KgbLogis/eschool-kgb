import React, { useEffect, useRef, useState } from 'react'
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { useMutation } from '@apollo/client';
import { DELETE_ONLINE_FILE_FOLDER } from 'graphql/lesson';
import { FolderSVG } from 'assets/svg/icon';

const { confirm } = Modal;

const Folder = ({ data, setFolder, setFolderHistory, refetch }) => {

	const [points, setPoints] = useState({ x: 0, y: 0 });
	const [show, setShow] = useState(false);

	const ref = useRef(null);

	const [deleteFolder] = useMutation(DELETE_ONLINE_FILE_FOLDER, {
		onCompleted: data => {
			message.success('Амжилттай устлаа');
			refetch()
		}
	})

	function onFolderClicked ({ id, name }) {
		setFolder(id)
		setFolderHistory(prevData => [...prevData, { id: id, name: name }])
	}

	function onDragOver (e) {
		e.stopPropagation();
	  }
	
	function onDragEnter (e) {
		e.stopPropagation();
	  }
	
	function onFileDrop (e) {
		e.stopPropagation();
	}

	function onDelete (id) {
		confirm({
            title: 'Устгах уу?',
            okText: 'Устгах',
            okType: 'danger',
            cancelText: 'Болих',
            onOk() {
				deleteFolder({ variables: { id: id } })
            },
		});
	}
	
	useEffect(() => {

		function onClickOutside() {
			setShow(false)
		}

		const handleClickOutside = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside && onClickOutside();
			}
		};
		document.addEventListener('contextmenu', handleClickOutside, true);
		document.addEventListener('click', handleClickOutside, true);
		return () => {
		  	document.removeEventListener('contextmenu', handleClickOutside, true);
			  document.addEventListener('click', handleClickOutside, true);
		};
	}, []);

	return (
		<>
			<div 
				className="relative hover:cursor-pointer"
				draggable
				onDragEnter={onDragEnter}
				onDragOver={onDragOver}
				onDropCapture={() => onFileDrop()}
				onContextMenuCapture={(e) => {
					e.preventDefault();
					setShow(true);
					setPoints({ x: e.pageX, y: e.pageY });
				}}
				onClick={() => onFolderClicked({ id: data.id, name: data.name })}
			>
				<div className="relative px-5 py-1 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
					<FolderSVG className="w-8 h-8 fill-emind my-auto" />
					<div className="space-y-2">
						<p className="text-slate-800 text-sm my-auto">{data.name}</p>
					</div>
				</div>
			</div>
			{ show && 
				<div ref={ref} className="absolute z-10"style={{
					top: points.y,
					left: points.x
				  }}> 
					<div className="bg-white w-60 border border-gray-300 rounded-lg flex flex-col text-sm py-4 px-2 text-gray-500 shadow-lg">
					<div className="flex py-1 px-2 rounded hover:bg-background hover:cursor-pointer">
						<div className="w-8 "><EditTwoTone twoToneColor="#ffdb00" /></div>
						<div>Засах</div>
					</div>
					<div className="flex py-1 px-2 rounded hover:bg-background hover:cursor-pointer" onClick={() => onDelete(data.id)}>
						<div className="w-8">
							<DeleteTwoTone twoToneColor="#eb2f96" key="delete" />
						</div>
						<div>Устгах</div>
					</div>
					</div>
				</div>
			}
		</>
	)
}

export default Folder