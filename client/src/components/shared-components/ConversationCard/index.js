import React from 'react'
import moment from 'moment'
import userImage from "assets/image/user.png"

const ConversationCard = ({ data, selected, setSelected, setCheckedList, isChecked, to }) => {

    function onCardClick(e) {
        switch (e.target.id) {
            case 'checkbox':
                break;
            case 'delete':
                break
            default:
                setSelected(data.id)
                break;
        }
    }

    function onCheckBoxChange(e) {
        if (e.target.checked) {
            setCheckedList(prevList => [...prevList, data.id]);
        } else {
            setCheckedList(prevList => prevList.filter((item) => item !== data.id));
        }
    }

    return (
        <li
            className="flex px-7 space-x-6 group md:py-6 py-3 relative cursor-pointer hover:bg-slate-50 group items-center rtl:space-x-reverse"
            onClick={onCardClick}
        >
            <div>
                <input
                    onChange={onCheckBoxChange}
                    id={"checkbox"}
                    checked={isChecked}
                    name={data.id}
                    className="focus:ring-indigo-500 h-4 w-4 accent-emind border-gray-300 rounded"
                    type="checkbox"
                />
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="flex-none">
                    <div className="h-8 w-8 rounded-full text-white">
                        <img
                            src={userImage}
                            alt=""
                            className="block w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div
                    className="font-medium text-slate-900 "
                >
                    {to ?
                        `${data.recipient.lastName} ${data.recipient.firstName}`
                        :
                        `${data.sender.lastName} ${data.sender.firstName}`
                    }
                </div>
            </div>

            <p className="truncate">
                <span
                    className="font-medium text-slate-900 "
                >
                    {data.subject}
                </span>
                <span className="text-sm ml-4 text-slate-600 font-normal">
                    {data.body}
                </span>
            </p>

            <div className="grow"></div>

            <span>
                <div className="flex-1 flex space-x-4 items-center">
                    <span className="flex-none space-x-2 text-xs text-slate-900 ">
                        <span>{moment(data.createdAt).format("MMM D")}</span>
                    </span>
                </div>
            </span>
        </li>
    )
}

export default ConversationCard