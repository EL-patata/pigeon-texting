'use client';
import React, { FC, useEffect, useState } from 'react';
import ChatBody from './ChatBody';
import ChatInput from './ChatInput';
import { CastedUser } from '@/app/dashboard/page';
import ChatHeader from './ChatHeader';
import { Chats } from './Chats';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from './AddFriend';

type Props = {
	currentUser: CastedUser;
	chatId: string;
};

const Chat: FC<Props> = ({ currentUser, chatId }) => {
	const [chat, setChat] = useState<Chats>();
	const [otherUser, setOtherUser] = useState<User>();

	useEffect(() => {
		async function getChat() {
			const chatDoc = doc(db, 'chats', chatId);

			return onSnapshot(chatDoc, (snapshot) => {
				const chatData: any = snapshot?.data();

				setChat(chatData);
			});
		}

		async function getOtherUser() {
			const otherUserId =
				currentUser?.id === chatId.split('__')[0]
					? chatId.split('__')[1]
					: chatId.split('__')[0];

			const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));

			setOtherUser(otherUserDoc.data() as any);
		}

		getOtherUser();

		getChat();
	}, []);

	return (
		<main className={`messages-outer-container ${chat?.theme as string}`}>
			<ChatHeader
				currentUser={currentUser}
				otherUser={otherUser as User}
				chatId={chatId}
				chat={chat as Chats}
			/>
			<ChatBody
				currentUser={currentUser}
				otherUser={otherUser as User}
				chatId={chatId}
			/>
			<ChatInput currentUser={currentUser} chatId={chatId} />
		</main>
	);
};

export default Chat;
