import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client';
import { GET_LIVE_URL } from 'graphql/live';
import { useParams, useHistory } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import Loading from 'components/shared-components/Loading';
import { UserContext } from 'hooks/UserContextProvider';
import { MEETING_DOMAIN } from 'configs/AppConfig';

export default function Live(props) {

    const { meetingId } = useParams()
    const history = useHistory();

    const [meetingUrl, setMeetingUrl] = useState("")
    const [password, setPassword] = useState("")

    const { user } = useContext(UserContext)

    const handleJitsiIFrameRef = (iframeRef) => {
        iframeRef.className =
            "h-[85vh] flex items-center shadow my-6 md:my-10 lg:h-[80vh]";
    };

    const { loading } = useQuery(GET_LIVE_URL, {
        variables: { liveId: meetingId },
        onCompleted: result => {
            setMeetingUrl(result.getLiveurl.url)
            setPassword(result.getLiveurl.password)
        }
    })

    const handleApiReady = (externalApi) => {
        externalApi.addEventListener("participantRoleChanged", (event) => {
            if (event.role === "moderator") {
                externalApi.executeCommand("password", password);
            }
        });

        externalApi.addEventListener("passwordRequired", () => {
            externalApi.executeCommand("password", password);
        });
    };

    function handleReadyToClose() {
        history.push('/app/live');
    }

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <JitsiMeeting
                getIFrameRef={handleJitsiIFrameRef}
                domain={MEETING_DOMAIN}
                roomName={meetingUrl}
                spinner={Loading}
                userInfo={{
                    displayName: user.firstName
                }}
                onReadyToClose={handleReadyToClose}
                onApiReady={handleApiReady}
            />
        </>
    )
}
