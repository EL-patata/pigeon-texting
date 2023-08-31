'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeChanger() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="gap-4">
					<Sun className="h-[1.2rem] w-[1.2rem] block dark:hidden" />
					<Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
					<span>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center">
				<DropdownMenuItem
					className="cursor-pointer gap-4 hover:text-primary transition-all"
					onClick={() => setTheme('light')}
				>
					<Sun /> Light
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer gap-4 hover:text-primary transition-all"
					onClick={() => setTheme('dark')}
				>
					<Moon /> Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					className="cursor-pointer gap-4 hover:text-primary transition-all"
					onClick={() => setTheme('system')}
				>
					<Monitor /> System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
