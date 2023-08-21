import { ValidatorFn, AbstractControl } from '@angular/forms';

export function minArrayLengthValidator(minLength: number): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
		const array = control.value as string[];
		if (array && array.length < minLength)
			return { minArrayLength: true };
		return null;
	};
}

