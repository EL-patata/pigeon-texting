'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { ImageIcon, Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore';
import { app, db } from '@/lib/firebase';
import { ChangeEvent, FC } from 'react';
import { CastedUser } from '@/app/dashboard/page';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';

type Props = { chatId: string; currentUser: CastedUser };

const ChatInput: FC<Props> = ({ chatId, currentUser }) => {
	const formSchema = z.object({
		message: z.string().min(1),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: '',
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		const messagesDoc = collection(db, 'chats', chatId, 'messages');

		form.reset({ message: '' });

		await addDoc(messagesDoc, {
			createdBy: currentUser?.id,
			createdByUsername: `${currentUser?.firstName} ${currentUser?.lastName}`,
			type: 'text',
			content: data.message,
			createdAt: serverTimestamp(),
		});

		await updateDoc(doc(db, 'chats', chatId), {
			lastMessageSentBy: `${currentUser.firstName} ${currentUser.lastName}`,
			lastMessageContent: data.message,
		});
	}

	async function sendImage(e: ChangeEvent<HTMLInputElement>) {
		const image = e.target.files?.item(0) as File;

		const imagesRef = ref(
			getStorage(app),
			`chats/${chatId}/${image.name}__${currentUser.id}__${Date.now()}`
		);

		const uploadImage = uploadBytesResumable(imagesRef, image);

		console.log(image);

		uploadImage.on(
			'state_changed',
			(snapshot) => {},
			() => {},
			() => {
				const messagesDoc = collection(db, 'chats', chatId, 'messages');

				getDownloadURL(uploadImage?.snapshot?.ref).then((url) => {
					addDoc(messagesDoc, {
						createdBy: currentUser?.id,
						createdByUsername: `${currentUser?.firstName} ${currentUser?.lastName}`,
						type: 'image',
						content: url,
						createdAt: serverTimestamp(),
					}).then(() => {
						updateDoc(doc(db, 'chats', chatId), {
							lastMessageSentBy: `${currentUser.firstName} ${currentUser.lastName}`,
							lastMessageContent: 'Sent a photo.',
						});
					});
				});
			}
		);

		e.target.files = null;
	}

	return (
		<footer className="p-2 border-t-2">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-center w-full rounded 
          outline outline-transparent outline-1 focus-within:outline-[var(--grad-color-2)] 
          focus-within:ring-1 focus-within:ring-[var(--grad-color-3)] 
					focus-within:ring-offset-1 focus-within:ring-offset-[var(--grad-color-1)]
					"
				>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormControl>
									<Textarea
										onKeyDown={(e) => {
											if (
												e.key === 'Enter' &&
												!e.shiftKey &&
												!form.formState.isSubmitting
											) {
												e.preventDefault();
												form.handleSubmit(onSubmit)();
											}
										}}
										className="rounded p-2 w-full resize-none h-12 md:h-auto focus-visible:ring-offset-0 focus-visible:ring-transparent"
										placeholder="Message"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<span className="flex items-center gap-2 p-2 rounded">
						<Button
							type="submit"
							size={'icon'}
							disabled={!form.formState.isValid || form.formState.isSubmitting}
							className="rounded-full text-white mx-auto messages-button"
						>
							<Send />
						</Button>
						<label
							htmlFor="file"
							role="button"
							className="block messages-button p-2 rounded-full cursor-pointer text-white"
						>
							<ImageIcon />
						</label>
						<input
							onChange={(e) => sendImage(e)}
							id="file"
							type="file"
							className="h-0 w-0"
							accept="image/*"
						/>
					</span>
				</form>
			</Form>
		</footer>
	);
};

export default ChatInput;
