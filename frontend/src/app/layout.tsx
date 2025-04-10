import type { Metadata } from 'next';
import { Poppins, Geist_Mono } from 'next/font/google';
import './globals.css';

const poppinsSans = Poppins({
	weight: ['400', '500', '600', '700'],
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Parce, una pola',
	description:
		'Es una plataforma para poder cuadrar las polas con los amigos',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppinsSans.className} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
