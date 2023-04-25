declare global {
	interface Window {
		Telegram: {
			Login: TelegramLogin;
		};
	}
}

export interface TelegramLogin {
	auth(options: any, callback: (data: any) => void): void;
}

export {};