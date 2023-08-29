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

