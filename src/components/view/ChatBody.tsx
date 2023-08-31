'use client';
import { CastedUser } from '@/app/dashboard/page';
import { db } from '@/lib/firebase';
import {
	Timestamp,
	collection,
	onSnapshot,
	orderBy,
	query,
} from 'firebase/firestore';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { User } from './AddFriend';
import Image from 'next/image';

type Props = { chatId: string; currentUser: CastedUser; otherUser: User };

type Messages = {
	createBy: string;
	createByUsername: string;
	type: string;
	content: string;
	createdAt: Timestamp;
};

const ChatBody: FC<Props> = ({ chatId, currentUser }) => {
	const [messages, setMessages] = useState<Messages[]>([]);

	const urlDetector = z.string().url().or(z.literal(''));

	const scrollRef = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		async function getMessages() {
			const messagesDoc = collection(db, 'chats', chatId, 'messages');

			const q = query(messagesDoc, orderBy('createdAt'));

			return onSnapshot(q, (snapshot) => {
				setMessages(
					snapshot.docs.map(
						(doc) =>
							({
								createBy: doc.data()?.createdBy,
								createByUsername: doc.data()?.createdByUsername,
								type: doc.data()?.type,
								content: doc.data()?.content,
								createdAt: doc.data()?.createdAt,
							} as Messages)
					)
				);
			});
		}

		getMessages();
	}, []);

	useEffect(() => {
		scrollRef?.current?.scrollIntoView();
	}, [messages]);

	return (
		<section className="messages-container">
			{messages.map((message) => {
				const key = `${message.createBy} ${message.createdAt}`;

				if (message.type === 'text') {
					return (
						<span
							key={key}
							className={`message ${
								message.createBy === currentUser.id
									? 'current-user'
									: 'other-user'
							} whitespace-normal break-all`}
						>
							<p>
								{message.content.split(' ').map((text) => {
									if (urlDetector.safeParse(text).success)
										return (
											<>
												{' '}
												<Link className="underline" href={text}>
													{text}
												</Link>{' '}
											</>
										);
									return <> {text} </>;
								})}
							</p>
						</span>
					);
				}
				if (message.type === 'image') {
					return (
						<div
							key={`${message?.createdAt} ${message.createBy}`}
							className={`bg-background  my-6 grid h-[60%] w-[30%] rounded-lg ${
								`${currentUser.firstName} ${currentUser.lastName}` ===
								message?.createByUsername
									? 'self-end place-items-end'
									: 'place-items-start'
							}`}
						>
							<Image
								className="w-auto h-auto min-w-[100px] min-h-[100px] md:min-w-[200px] md:min-h-[200px] max-h-full max-w-[100%] rounded-lg"
								src={message?.content}
								alt=""
								width={400}
								height={400}
							/>
						</div>
					);
				}
			})}
			<div ref={scrollRef} />
		</section>
	);
};

export default ChatBody;
