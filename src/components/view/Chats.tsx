'use client';
import { CastedUser } from '@/app/dashboard/page';
import { db } from '@/lib/firebase';
import {
	Timestamp,
	collection,
	onSnapshot,
	or,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = { currentUser: CastedUser };

export type Chats = {
	id: string;
	lastMessageSent: Timestamp;
	lastMessageSentBy: string;
	lastMessageContent: string;
	theme: string;
	userOneEmail: string;
	userOneId: string;
	userOneUsername: string;
	userOneImg: string;
	userTwoEmail: string;
	userTwoId: string;
	userTwoUsername: string;
	userTwoImg: string;
};

const Chats = ({ currentUser }: Props) => {
	const [chats, setChats] = useState<Chats[]>(null!);

	useEffect(() => {
		async function getRequests() {
			const q = query(
				collection(db, 'chats'),
				or(
					where('userOneId', '==', currentUser?.id),
					where('userTwoId', '==', currentUser?.id)
				),
				orderBy('lastMessageSent')
			);

			return onSnapshot(q, async (snapshot) => {
				setChats(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any
				);
			});
		}

		getRequests();
	}, []);

	const path = usePathname();

	return (
		<main className="pt-32 p-4 w-full lg:w-[calc(100vw-24rem)]">
			<h1 className="text-2xl font-bold">
				{path === '/dashboard' ? 'Recent chats' : 'Chats'}
			</h1>
			<section>
				{chats &&
					chats?.map((chat) => (
						<Link
							key={chat.id}
							href={`/chats/${chat.id}`}
							className="flex relative overflow-hidden items-center gap-4 p-4 bg-accent rounded group hover:bg-primary/20 transition-all"
						>
							<Image
								src={
									currentUser.id === chat.userOneId
										? chat.userTwoImg
										: chat.userOneImg
								}
								alt={`${
									currentUser.id === chat.userOneId
										? chat.userTwoUsername
										: chat.userOneUsername
								}
							profile picture
							`}
								width={60}
								height={60}
								className="rounded-full"
							/>
							<div className="text-xs md:text-base max-w-[70%]">
								<h3 className="text-base md:text-lg font-bold">
									{currentUser.id === chat.userOneId
										? chat.userTwoUsername
										: chat.userOneUsername}
								</h3>
								<p className="text-muted-foreground truncate">
									{chat.lastMessageContent || 'nothing to show here'}
								</p>
							</div>
							<div className="text-sm md:text-base ml-auto">
								<p>{chat.lastMessageSent.toDate().toLocaleTimeString()}</p>
								<p className="truncate overflow-hidden  text-muted-foreground">
									by{' '}
									{`${currentUser.firstName} ${currentUser.lastName}` ===
									chat.lastMessageSentBy
										? 'You'
										: chat.lastMessageSentBy}
								</p>
							</div>
							<ChevronRight className="group-hover:translate-x-2 transition-all" />
						</Link>
					))}
				{chats?.length === 0 && (
					<p className="text-muted-foreground">Nothing to show here</p>
				)}
			</section>
		</main>
	);
};

export default Chats;
