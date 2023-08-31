'use client';
import { CastedUser } from '@/app/dashboard/page';
import { app, users } from '@/lib/firebase';
import { useAuth } from '@clerk/nextjs';
import { signInWithCustomToken, getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';

const Home = ({ currentUser }: { currentUser: CastedUser }) => {
	const { getToken } = useAuth();

	useEffect(() => {
		const signInWithClerk = async () => {
			const auth = getAuth(app);
			const token = await getToken({ template: 'integration_firebase' });
			const userCredentials = await signInWithCustomToken(auth, token!);

			const userDoc = doc(users, currentUser.id);

			const userExists = await getDoc(userDoc);

			if (!userExists.exists()) {
				await setDoc(userDoc, {
					id: currentUser?.id,
					username: `${currentUser.firstName} ${currentUser.lastName}`,
					email: currentUser?.emailAddress,
					photoUrl: currentUser.imageUrl,
					friends: [],
				});
			}
		};

		signInWithClerk();
	}, []);

	return null;
};

export default Home;
