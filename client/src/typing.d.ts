import { NavbarProfile } from "@shared-models/profile.model";

interface NotificationDto {
	user: NavbarProfile;
	viewed: boolean;
	message: string;
	date: Date;
}