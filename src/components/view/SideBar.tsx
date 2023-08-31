'use client';
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react';
import { ThemeChanger } from './ThemeChanger';
import { Button } from '../ui/button';
import { Menu, MessagesSquareIcon, UserCheck, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import NavLink from '../ui/NavLink';
import { UserButton } from '@clerk/nextjs';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CastedUser } from '@/app/dashboard/page';
import NavLinkExtended from '../ui/NavLinkExtended';

type Props = {
	currentUser?: CastedUser;
};

const SideBar: FC<Props> = ({ currentUser }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [requestsNumber, setRequestsNumber] = useState<number>(0);

	useEffect(() => {
		async function getRequests() {
			const q = query(
				collection(db, 'requests'),
				where('to', '==', currentUser?.emailAddress),
				orderBy('createdAt')
			);

			return onSnapshot(q, async (snapshot) => {
				setRequestsNumber(snapshot.docs.length);
			});
		}

		getRequests();
	}, []);

	return (
		<>
			<Button
				size={'icon'}
				tabIndex={1}
				className="lg:hidden lg:invisible text-white fixed z-50 right-[2%] top-[2%]"
				onClick={() => setIsOpen(true)}
			>
				<Menu />
			</Button>
			<nav
				className={`fixed lg:relative top-0 left-0 p-[2px] md:p-4 transition-transform duration-300
				${
					isOpen
						? 'translate-x-0 visible'
						: '-translate-x-full md:-translate-x-[24rem] invisible'
				}  z-50 lg:translate-x-0 lg:visible w-full md:w-[24rem] h-screen 
				bg-background border-r-2 flex flex-col gap-4 items-center`}
			>
				<Button
					className="absolute top-3 right-3 lg:hidden lg:invisible rounded-full"
					size={'icon'}
					onClick={() => setIsOpen(false)}
				>
					<X />
				</Button>
				<Link href={'/dashboard'} className="grid place-items-center">
					<span className="w-[4.5rem] aspect-square grid place-items-center rounded-full bg-accent">
						<span className="block relative w-14 bg-gradient-to-tr from-indigo-600 via-fuchsia-400-500 to-purple-700 aspect-square rounded-full">
							<Image src={`/logo.svg`} fill alt="logo" />
						</span>
					</span>
					<p className="font-mono font-bold text-lg">Pigeon-texting</p>
				</Link>

				<div className="w-full grid gap-1">
					<Link
						onClick={() => setIsOpen(false)}
						href={`/add`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
					>
						<UserPlus />
						<p>Add friends</p>
					</Link>

					<Link
						onClick={() => setIsOpen(false)}
						href={`/chats`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
					>
						<MessagesSquareIcon />
						<p>Chats</p>
					</Link>

					<Link
						onClick={() => setIsOpen(false)}
						href={`/requests`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
					>
						<UserCheck />
						<p>Friend Requests</p>
						{requestsNumber !== 0 && (
							<p className="ml-auto bg-accent text-primary dark:text-white w-[1.5rem] h-[1.5rem] rounded-full grid place-items-center">
								{requestsNumber}
							</p>
						)}
					</Link>
				</div>
				{/* <div className="w-full grid gap-1">
					<NavLink
						onClick={() => setIsOpen(false)}
						href={`/add`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
						activeClassName="bg-primary/30 text-primary  dark:bg-primary/50 dark:text-foreground"
						NotActiveClassName="hover:bg-accent"
					>
						<UserPlus />
						<p>Add friends</p>
					</NavLink>

					<NavLinkExtended
						onClick={() => setIsOpen(false)}
						href={`/chats`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
						activeClassName="bg-primary/30 text-primary  dark:bg-primary/50 dark:text-foreground"
						NotActiveClassName="hover:bg-accent"
					>
						<MessagesSquareIcon />
						<p>Chats</p>
					</NavLinkExtended>

					<NavLink
						onClick={() => setIsOpen(false)}
						href={`/requests`}
						className="flex items-center gap-2 rounded-lg p-4 w-full transition-colors"
						activeClassName="bg-primary/30 text-primary  dark:bg-primary/50 dark:text-foreground"
						NotActiveClassName="hover:bg-accent"
					>
						<UserCheck />
						<p>Friend Requests</p>
						{requestsNumber !== 0 && (
							<p className="ml-auto bg-accent text-primary dark:text-white w-[1.5rem] h-[1.5rem] rounded-full grid place-items-center">
								{requestsNumber}
							</p>
						)}
					</NavLink>
				</div> */}

				<ThemeChanger />

				<UserButton
					afterSignOutUrl="/sign-in"
					appearance={{
						elements: {
							card: 'bg-background text-foreground',
							userPreviewTextContainer: 'text-foreground',
							userButtonPopoverActionButton: 'bg-red-500',
							userButtonPopoverActionButtonIcon: 'text-foreground',
							userButtonPopoverActionButtonText: 'text-foreground',
						},
					}}
				/>
			</nav>
			<div
				onClick={() => setIsOpen(false)}
				className={`fixed z-40 top-0 w-screen h-screen bg-accent/30 ${
					isOpen ? 'block' : 'hidden'
				} lg:hidden lg:invisible`}
			/>
		</>
	);
};

export default SideBar;
