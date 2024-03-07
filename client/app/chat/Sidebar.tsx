"use client"
import React from 'react'
import { ButtonTemplate, Divider, BoxTemplate } from '@/components'

interface SessionProps {
    id: string;
}

interface SidebarProps {
    sessions: SessionProps[];
    handleAddNewSession: () => void;
}

export default function Sidebar({
    sessions,
    handleAddNewSession
}: SidebarProps) {
    const handleDeleteSession = async (sessionId: string) => console.log("DELETE BUTTON!")

    console.log("SESSIONS PASSED THROUGH:", sessions)
    return (
        <div className="flex flex-col h-screen w-1/3"> 
            <div className='bg-neutral-500 w-full h-20 items-center relative flex justify-between'>
                <h4 className=''>Profile Icon</h4>
                <div className='flex flex-row'>
                    <h4 className=''>Friendlist</h4>
                    <h4 className=''>Icon</h4>
                </div>


            </div>
            <ButtonTemplate label='NEW CHAT' className='m-4' onPress={() => handleAddNewSession()}/>

            {sessions.map((session, index) => (
                <React.Fragment key={`session-${index}`} >
                    <div className='flex flex-row justify-between p-3'>
                        <BoxTemplate 
                            id={session}
                            // chatWith={session.chatWith}
                            boxStyle={'flex items-center justify-start'}
                        />
                        <ButtonTemplate label='X' className='justify-center' onPress={() => handleDeleteSession(session.id)}/>
                    </div>
                    <Divider className="my-4 self-center" />
                </React.Fragment>
            ))}
        </div>
    )
}
