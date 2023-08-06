interface UserDto {
	firstName: string;
	lastName: string;
	profilePictureSrc?: string;
	location: string;
	likesNb?: number;
	matchesNb?: number;
	fameRate?: number;
	resume?: string;
}

interface NotificationDto {
	user: UserDto;
	viewed: boolean;
	message: string;
	date: Date;
}