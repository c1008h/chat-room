'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { MessageContainer, CardTemplate, ButtonTemplate, MessageInput, FormTemplate, BoxTemplate, Error, InputForm, Loading } from '@/components'
import { useParticipants, useSession, useMessage } from '@/hooks';
import { useSessionsListener, useParticipantsListener, useChatListener, useFriendListener } from '@/hooks';
import { useAuth } from '@/provider/AuthProvider';
import Sidebar from './Sidebar';
import { Participant } from '@/interfaces/Participant';
import { Friend } from '@/interfaces/Friend';
import { addAParticipant, backspaceParticipant, clearParticipants } from '@/features/participants/participantSlices';
import { RootState } from '@/features/store';
import { current } from '@reduxjs/toolkit';

export default function Page() {
  const [message, setMessage] = useState<string>('') 
  const [uid, setUid] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [addToChat, setAddToChat] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState('');
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([])

  const dispatch = useDispatch(); 
  const router = useRouter();

  const { currentUser } = useAuth();
  const participantList = useSelector((state: RootState) => state.participant.participants);
  const activeSessionID = useSelector((state: RootState) => state.session.currentSession)
  const userState = useSelector((state:RootState) => state.auth.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const { friends } = useFriendListener(currentUser?.uid)
  const { addASession, deleteSession, leaveSession, currentSessionId } = useSession()
  const { sessions, loading: sessionLoading, error: sessionError, sessionDetails } = useSessionsListener(currentUser?.uid)

  const { addParticipant, removeParticipant, removeSpecificParticipant } = useParticipants();
  const { participants, error: participantError } = useParticipantsListener(activeSessionID);

  const { sendMessage } = useMessage()
  const { messages, error: chatError } = useChatListener(activeSessionID)
  // console.log("CURRENT SESSION ID IN PAGE:", activeSessionID)

  useEffect(() => {
    if (currentUser) {
      // console.log("USER STATE UID:", userState)
      console.log(typeof currentUser.uid)
      setUid(currentUser.uid)
    } else {
      router.push('/login')
    }
    return () => {

    }
  }, [isAuthenticated, currentUser, userState, router])

  useEffect(() => {
    if (inputValue.length > 2) {
      const lowercasedInput = inputValue.toLowerCase().trim()
      const filtered = friends.filter(friend =>
        friend.displayName?.toLowerCase().includes(lowercasedInput) ||
        friend.email?.toLowerCase().includes(lowercasedInput) ||
        friend.phoneNumber?.includes(inputValue.trim()) ||
        friend.uid.includes(inputValue.trim())
      )
      setFilteredFriends(filtered)
    } else {
      setFilteredFriends([])
    }
  }, [inputValue, friends])
  
  const handleNewChat = () => {
    if(!uid) return
    dispatch(clearParticipants())
    setAddToChat(true);
    addASession(uid)
  }

  const handleAddParticipant = (friend: Friend) => {
    const participantName = inputValue.trim();
    console.log("PART NAME:", participantName)
    // const isAlreadyAdded = participantList.some(p => p.name === participantName);
    // if (isAlreadyAdded) {
    //   setInputValue('')
    //   dispatch(removeParticipant())
    // }

    // WRITE LOGIC FOR IF USER INPUTS THE SAME PERSON
    // SHOULD EMPTY INPUT VALUE AND NOT DUPLICATE 
    if (participantName && activeSessionID) {
      // const newParticipant = { uid: '0DVpCJ7HYHMLRNT30wJd4YwV2oI3', name: participantName};
      const newParticipant = { 
        uid: friend.uid, 
        displayName: friend.displayName || '', 
        email: friend.email || '', 
        phoneNumber: friend.phoneNumber || '' 
      };

      dispatch(addAParticipant(newParticipant));
      addParticipant(activeSessionID, newParticipant);
      setInputValue(''); 
    }
  };

  const handleBackSpace = () => {
    dispatch(backspaceParticipant())
    removeParticipant()
  }

  // const handleSendMessage = () => {
  //   if (uid && activeSessionID ) {

  //     console.log("Active session ID:", activeSessionID)
  //     const messageData = {
  //       message: message,
  //       type:'message'
  //       sender: { uid: uid, displayName: displayName },
  //       timestamp: new Date().toISOString()
  //     }
  
  //     sendMessage(activeSessionID, messageData)
  //   }
  // }
  const handleSelectFriend = (friend: Friend) => {
    if (activeSessionID) {
      const newParticipant = { 
        uid: friend.uid, 
        displayName: friend.displayName || null, 
        email: friend.email || null, 
        phoneNumber: friend.phoneNumber || null 
      };
      dispatch(addAParticipant(newParticipant));
      addParticipant(activeSessionID, newParticipant);
      setInputValue(''); // Clear input
      setFilteredFriends([]); // Clear filtered friends list
    }
  };
  
  if (sessionLoading) return <Loading message={'Loading sessions...'} />
  if (sessionError) {
    console.error(sessionError);
    return <Error message={'Error loading sessions. Please try again later.'} error={sessionError}/>
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-400	">
      <div className="flex flex-row flex-1 ">
        {/* LEFT SESSION NAVIGATION */}
        {uid && (
          <Sidebar 
            sessions={sessionDetails}
            handleAddNewSession={handleNewChat}
            userId={uid}
            currentSessionId={currentSessionId ?? ''}
          />
        )}

        {/* RIGHT SIDE OF SCREEN */}
        <div className="w-2/3 h-screen bg-gray-100 flex flex-col gap-4 relative">
          <div className='relative flex top-0 bg-slate-400 w-full h-24 justify-center items-center'>
            {addToChat ? (
              <div className='flex items-center flex-row bg-slate-400 text-white' >
                <label className='mr-2' htmlFor="participantInput">To: </label>
                {participantList && participantList.map((participant: Participant, index: number) => (
                  <div key={index} className='participant-block mr-2 mb-2 bg-gray-300 text-gray-700 p-2 rounded-lg flex items-center'>
                    <p>{participant.displayName ? participant.displayName : participant.email ? participant.email : participant.phoneNumber}</p>
                  </div>
                ))}
                <input 
                  id="participantInput"
                  value={inputValue}
                  className='bg-slate-400 no-border outline-none'
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={(event) => { 
                    if (event.key === 'Enter' || event.key === ' ') {
                      // handleAddParticipant(friend); 
                    } else if (event.key === 'Backspace' && !inputValue.trim()) {
                      // removeParticipant();
                      handleBackSpace()
                    }
                  }}
                />
                {filteredFriends.length > 0 && (
                  <div className="absolute bg-white border mt-1 max-h-60 overflow-auto z-10">
                    {filteredFriends.map(friend => (
                      <div className='' key={friend.uid} onClick={() => handleSelectFriend(friend)}>
                        <p>{friend.displayName ? friend.displayName : friend.email ? friend.email : friend.phoneNumber}</p>
                      </div>
                    ))}
                  </div>
                )}
                <ButtonTemplate
                  // onPress={() =>       
                  //   // addParticipant(activeSessionID, newParticipant);
                  // }
                  label={'+'}
                  // disabled={participants.length < 1 || participants == null}
                />
              </div>
            ) : (
              <h3 className='text-white'>To: {participants && participants.map(participant => participant.displayName).join(', ')}</h3>
            )}
          </div>
            {/* {messages && messages.map((message, index) => (
              <React.Fragment key={`message-${index}`}>
                <CardTemplate 
                  id={message.id}
                  message={message.message}
                  sender={message.sender.displayName}
                  timestamp={message.timestamp}
                  alignment={message.sender === uid ? 'right' : 'left'}
                />
              </React.Fragment>
            ))} */}

          <MessageContainer 
            messages={messages} 
            uid={currentUser?.uid}
            displayName={displayName}
          />
          {/* TEXT BOX SHOULD BE BOTTOM OF SCREEN */}
          <div className="w-2/3 flex fixed bottom-0 p-4 bg-white">
            <MessageInput 
              sendMessage={sendMessage}
              sessionId={activeSessionID}
              uid={currentUser?.uid}
              displayName={displayName}
            />
            {/* <form 
              className="flex w-full" 
              onSubmit={(e) => {
                e.preventDefault(); 
                handleSendMessage();
              }}
            >
              <FormTemplate 
                className={'bg-white shadow rounded-lg overflow-hidden'}
                onValueChange={(value: string) => setMessage(value)}
                value={message}
              />
              <ButtonTemplate 
                className=""
                label={"Send"}
                onPress={() => {
                  if (message.trim()) {
                    handleSendMessage()
                    setMessage('')
                  } else {
                    console.error("message is empty")
                  }
                }}
              />
            </form> */}
          </div>
        </div>
      </div>
    </div>
  );
}
