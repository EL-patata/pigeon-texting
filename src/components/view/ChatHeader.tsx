'use client';

import { CastedUser } from '@/app/dashboard/page';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FC } from 'react';
import { Chats } from './Chats';
import { Button } from '../ui/button';
import { User } from './AddFriend';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';

type Props = {
	chatId: string;
	currentUser: CastedUser;
	chat: Chats;
	otherUser: User;
};

const ChatHeader: FC<Props> = ({ chatId, currentUser, otherUser, chat }) => {
	async function changeTheme(
		theme: 'base' | 'orange' | 'green' | 'blue' | 'purple' | 'silver' | 'rose'
	) {
		updateDoc(doc(db, 'chats', chat?.id), {
			theme,
		});
	}

	return (
		<header className="overflow-hidden border-b-2">
			<div className="w-[calc(100%-64px)] lg:w-full h-full p-4 flex items-center gap-3">
				<span>
					<Image
						src={otherUser?.photoUrl}
						alt={`${otherUser?.username} profile picture`}
						width={50}
						height={50}
						className="rounded-full"
					/>
				</span>
				<h2 className="font-bold text-lg flex-1">{otherUser?.username}</h2>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button className="rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]">
							Theme
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel className="text-center">
							Themes
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup className="grid grid-cols-3 dropdown-menu">
							<DropdownMenuItem className="dropdown-menu">
								<Button
									onClick={() => changeTheme('base')}
									className="base p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									onClick={() => changeTheme('blue')}
									className="blue p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									onClick={() => changeTheme('orange')}
									className="orange p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									onClick={() => changeTheme('purple')}
									className="purple p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									onClick={() => changeTheme('green')}
									className="green p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Button
									onClick={() => changeTheme('rose')}
									className="rose p-0 h-8 w-8 rounded-full bg-gradient-to-tr from-[var(--grad-color-1)] via-[var(--grad-color-2)] to-[var(--grad-color-3)]"
								/>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};

export default ChatHeader;
