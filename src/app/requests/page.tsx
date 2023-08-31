import { currentUser } from '@clerk/nextjs';
import { CastedUser } from '../dashboard/page';
import FriendRequests from '@/components/view/FriendRequests';

const page = async () => {
	const user = await currentUser();

	const castedUser: CastedUser = {
		id: user?.id!,
		firstName: user?.firstName!,
		lastName: user?.lastName!,
		emailAddress: user?.emailAddresses[0].emailAddress!,
		imageUrl: user?.imageUrl!,
	};
	return <FriendRequests user={castedUser} />;
};

export default page;
