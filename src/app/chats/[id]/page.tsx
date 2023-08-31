import { CastedUser } from '@/app/dashboard/page';
import Chat from '@/components/view/Chat';
import ChatBody from '@/components/view/ChatBody';
import ChatInput from '@/components/view/ChatInput';
import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import React from 'react';

const Page = async ({ params }: { params: { id: string } }) => {
	const user = await currentUser();

	const usersIds = params.id.split('__');

	if (usersIds[0] !== user?.id && usersIds[1] !== user?.id) {
		return notFound();
	}

	const castedUser: CastedUser = {
		id: user?.id!,
		firstName: user?.firstName!,
		lastName: user?.lastName!,
		emailAddress: user?.emailAddresses[0].emailAddress!,
		imageUrl: user?.imageUrl!,
	};

	return <Chat currentUser={castedUser} chatId={params.id} />;
};

export default Page;
