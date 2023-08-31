import { currentUser } from '@clerk/nextjs';
import { CastedUser } from '../dashboard/page';
import Chats from '@/components/view/Chats';

const page = async () => {
	const user = await currentUser();

	const castedUser: CastedUser = {
		id: user?.id!,
		firstName: user?.firstName!,
		lastName: user?.lastName!,
		emailAddress: user?.emailAddresses[0].emailAddress!,
		imageUrl: user?.imageUrl!,
	};
	return <Chats currentUser={castedUser} />;
};

export default page;
