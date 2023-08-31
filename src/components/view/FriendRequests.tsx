'use client';
import { CastedUser } from '@/app/dashboard/page';
import { db } from '@/lib/firebase';
import {
	Timestamp,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { User } from './AddFriend';
import { Button } from '../ui/button';
import { Check, X } from 'lucide-react';
import Image from 'next/image';
import { emailSorter } from '@/lib/utils';

type Props = {
	user: CastedUser;
};

type FriendRequest = {
	id: string;
	from: string;
	fromId: string;
	fromImage: string;
	fromUserName: string;
	to: string;
	toId: string;
	createdAt: Timestamp;
};

const FriendRequests = ({ user }: Props) => {
	const [requests, setRequests] = useState<FriendRequest[]>();
	const [currentUser, setCurrentUser] = useState<User>();

	useEffect(() => {
		async function getRequests() {
			const currentUserDoc = doc(collection(db, 'users'), user?.id);

			const getCurrentUser = await getDoc(currentUserDoc);

			setCurrentUser({ ...(getCurrentUser.data() as any) });

			const q = query(
				collection(db, 'requests'),
				where('to', '==', user?.emailAddress),
				orderBy('createdAt')
			);

			return onSnapshot(q, async (snapshot) => {
				setRequests(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any
				);
			});
		}

		getRequests();
	}, []);

	async function accept(id: string, fromId: string, toId: string) {
		const requestDoc = doc(collection(db, 'requests'), id);

		const fromUserDoc = doc(collection(db, 'users'), fromId);

		const toUserDoc = doc(collection(db, 'users'), toId);

		const fromUser = await getDoc(fromUserDoc);

		const toUser = await getDoc(toUserDoc);

		const fromUserFriends = fromUser?.data()?.friends;

		const toUserFriends = toUser?.data()?.friends;

		await updateDoc(fromUserDoc, {
			friends: [...fromUserFriends, toUser?.data()?.email],
		});

		await updateDoc(toUserDoc, {
			friends: [...toUserFriends, fromUser?.data()?.email],
		});

		const chatDoc = doc(
			collection(db, 'chats'),
			emailSorter(fromUser?.data()?.id, toUser?.data()?.id)
		);

		await setDoc(chatDoc, {
			id: emailSorter(fromUser?.data()?.id, toUser?.data()?.id),
			theme: 'base',
			userOneEmail: fromUser.data()?.email,
			userOneId: fromUser.data()?.id,
			userOneUsername: fromUser.data()?.username,
			userOneImg: fromUser.data()?.photoUrl,
			userTwoEmail: toUser.data()?.email,
			userTwoId: toUser.data()?.id,
			userTwoUsername: toUser.data()?.username,
			userTwoImg: toUser.data()?.photoUrl,
			lastMessageSent: serverTimestamp(),
			lastMessageSentBy: '',
			lastMessageSentContent: '',
		});

		await deleteDoc(requestDoc);
	}

	async function deny(id: string) {
		const requestDoc = doc(collection(db, 'requests'), id);

		await deleteDoc(requestDoc);

		return onSnapshot(requestDoc, async (snapshot) => {
			setRequests(snapshot.data() as any);
		});
	}

	return (
		<main className="pt-32 p-4 w-full lg:w-[calc(100vw-24rem)]">
			<h1 className="text-2xl font-bold">Friend requests</h1>

			<section>
				{requests?.length !== 0 &&
					(requests?.map((request) => (
						<div
							key={request.id}
							className="mt-2 bg-accent p-4 rounded flex items-center gap-4"
						>
							<Image
								width={40}
								height={40}
								src={request?.fromImage}
								alt={`${request.fromUserName} profile picture`}
								className="rounded-full w-10 h-10"
							/>
							<span className="flex-1">
								<p className="font-bold text-lg">{request?.fromUserName}</p>
								<p>{request?.from}</p>
							</span>
							<Button
								onClick={() => accept(request.id, request.fromId, request.toId)}
								size={'icon'}
								className="text-white bg-emerald-500 hover:bg-emerald-400 rounded-full"
							>
								<Check />
							</Button>
							<Button
								onClick={() => deny(request.id)}
								size={'icon'}
								className="text-white bg-rose-600 hover:bg-rose-500 rounded-full"
							>
								<X />
							</Button>
						</div>
					)) as any)}
				{requests?.length === 0 && (
					<p className="text-muted-foreground">Nothing to show here</p>
				)}
			</section>
		</main>
	);
};

export default FriendRequests;
