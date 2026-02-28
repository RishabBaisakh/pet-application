import { createAPI } from "./axiosFactory";

interface ProfileClientRuntime {
	getAccessToken: () => string | null;
	logout: () => Promise<void>;
}

const profileClientRuntime: ProfileClientRuntime = {
	getAccessToken: () => null,
	logout: async () => undefined,
};

export function configureProfileClient(options: Partial<ProfileClientRuntime>) {
	if (options.getAccessToken) {
		profileClientRuntime.getAccessToken = options.getAccessToken;
	}
	if (options.logout) {
		profileClientRuntime.logout = options.logout;
	}
}

export const profileService = createAPI("profile", {
	getAccessToken: () => profileClientRuntime.getAccessToken(),
	logout: () => profileClientRuntime.logout(),
});
