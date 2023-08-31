export type CastedUser = {
	id: string;
	firstName: string;
	lastName: string;
	emailAddress: string;
	imageUrl: string;
};

import { currentUser } from '@clerk/nextjs';
import Chats from '@/components/view/Chats';
import Home from '@/components/view/Home';

const page = async () => {
	const user = await currentUser();

	const castedUser: CastedUser = {
		id: user?.id!,
		firstName: user?.firstName!,
		lastName: user?.lastName!,
		emailAddress: user?.emailAddresses[0].emailAddress!,
		imageUrl: user?.imageUrl!,
	};
	return (
		<>
			<Home currentUser={castedUser} />
			<Chats currentUser={castedUser} />
		</>
	);
};

export default page;
