import { ValidatorFn, AbstractControl } from '@angular/forms';

export function minArrayLengthValidator(minLength: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const array = control.value as string[];
		if (array && array.length < minLength)
			return { minArrayLength: true };
		return null;
	};
}

export function dateIsPastDateValidator(date = new Date()): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const inputDate = control.value as Date;
		if (inputDate && inputDate > date)
			return { dateIsPastDate: true };
		return null;
	};
}

export function ageValidator(age: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const dateOfBirth = new Date(control.value);

		if (isNaN(dateOfBirth.getTime()))
			return { 'invalidDate': true };

		const minBirthDate = new Date();
		minBirthDate.setFullYear(minBirthDate.getFullYear() - age);

		if (dateOfBirth > minBirthDate)
			return { 'ageError': true };

		return null;
	};
}

export function passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
	if (control.value == null || control.value === '')
		return null;

	const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
	if (!passwordRegex.test(control.value))
		return { invalidPassword: true };
	return null;
}
