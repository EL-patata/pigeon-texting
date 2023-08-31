import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function emailSorter(emailOne: string, emailTwo: string) {
	const emailArr = [emailOne, emailTwo].sort();

	return `${emailArr[0]}__${emailArr[1]}`;
}
