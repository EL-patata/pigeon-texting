'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore';
import { PlusIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CastedUser } from '@/app/dashboard/page';
import { emailSorter } from '@/lib/utils';

export type User = {
	id: string;
	email: string;
	username: string;
	photoUrl: string;
	friends: string[];
};

const AddFriend = ({
	currentUser: currentClerkUser,
}: {
	currentUser: CastedUser;
}) => {
	const [query, setQuery] = useState<string>('');

	const [currentUser, setUser] = useState<User>();

	const [users, setUsers] = useState<User[]>();

	const filteredUsers = users?.filter((user) => {
		if (
			!currentUser?.friends?.includes(user?.email) &&
			user?.email?.includes(query) &&
			user?.email !== currentUser?.email
		) {
			return user;
		}
	});

	useEffect(() => {
		async function getUsers() {
			const querySnapshot = await getDocs(collection(db, 'users'));

			setUsers(querySnapshot.docs.map((doc) => doc.data()) as any);
		}

		async function getUser() {
			const currentUserDoc = doc(collection(db, 'users'), currentClerkUser?.id);

			return onSnapshot(currentUserDoc, async (snapshot) => {
				setUser({ ...(snapshot.data() as any) });
			});
		}

		getUsers();
		getUser();
	}, []);

	async function addFriend(userEmail: string, userId: string) {
		const requestDoc = doc(
			collection(db, 'requests'),
			emailSorter(userEmail, currentUser?.email as string)
		);
		await setDoc(requestDoc, {
			from: currentUser?.email,
			fromId: currentUser?.id,
			fromImage: currentUser?.photoUrl,
			fromUserName: currentUser?.username,
			to: userEmail,
			toId: userId,
			createdAt: serverTimestamp(),
		});
	}

	return (
		<main className="pt-32 p-4 w-full lg:w-[calc(100vw-24rem)]">
			<h1 className="text-2xl font-bold">Send friend requests</h1>
			<div className="relative w-full">
				<Label htmlFor="search">Search</Label>
				<Input
					onChange={(e) => setQuery(e.target.value)}
					className="pr-10 w-full"
					id="search"
					placeholder={'Search user by email'}
				/>
				<SearchIcon className="absolute bottom-2 right-2" />
			</div>
			<section>
				{filteredUsers?.length !== 0 &&
					filteredUsers?.map((user) => (
						<div
							key={user.id}
							className="mt-2 bg-accent p-4 rounded flex items-center gap-4"
						>
							<Image
								width={40}
								height={40}
								src={user?.photoUrl}
								alt={`${user.username} profile picture`}
								className="rounded-full w-10 h-10"
							/>
							<span className="flex-1">
								<p className="font-bold text-lg">{user?.username}</p>
								<p>{user?.email}</p>
							</span>
							<span>
								<Button
									onClick={() => addFriend(user?.email, user?.id)}
									size={'icon'}
									className="text-white rounded-full"
								>
									<PlusIcon />
								</Button>
							</span>
						</div>
					))}
				{users?.length === 0 && (
					<p className="text-muted-foreground">Nothing to show here</p>
				)}
			</section>
		</main>
	);
};

export default AddFriend;
