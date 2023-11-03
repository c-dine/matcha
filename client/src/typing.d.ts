import { NavbarProfile } from "@shared-models/user.model";

interface NotificationDto {
	user: NavbarProfile;
	viewed: boolean;
	message: string;
	date: Date;
}