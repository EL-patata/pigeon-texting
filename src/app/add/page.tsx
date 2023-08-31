import AddFriend from '@/components/view/AddFriend';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';
import { CastedUser } from '../dashboard/page';

const page = async () => {
	const user = await currentUser();

	const castedUser: CastedUser = {
		id: user?.id!,
		firstName: user?.firstName!,
		lastName: user?.lastName!,
		emailAddress: user?.emailAddresses[0].emailAddress!,
		imageUrl: user?.imageUrl!,
	};

	return <AddFriend currentUser={castedUser} />;
};

export default page;
