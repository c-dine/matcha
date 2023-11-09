const msToTimeUnits = new Map([
	[ "s", 1000 ],
	[ "m", 60000 ],
	[ "h", 3.6e+6 ],
	[ "d", 8.64e+7 ],
	[ "w", 6.048e+8 ],
	[ "mo", 2.628e+9 ],
	[ "y", 31535965440.038185 ]
	
])

const convertMsToTimeUnits = {
	"s": (ms: number): string => Math.floor(ms / 1000).toString(),
	"m": (ms: number): string => Math.floor(ms / 1000 / 60).toString(),
	"h": (ms: number): string => Math.floor(ms / 1000 / 60 / 60).toString(),
	"d": (ms: number): string => Math.floor(ms / 1000 / 60 / 60 / 24).toString(),
	"w": (ms: number): string => Math.floor(ms / 1000 / 60 / 60 / 24 / 7).toString(),
	"mo": (ms: number): string => Math.floor(ms / 1000 / 60 / 60 / 24 / 30).toString(),
	"y": (ms: number): string => Math.floor(ms / 1000 / 60 / 60 / 24 / 30/ 365).toString(),
}


export function printTime(time: number) {
	let timeUnit: string = "s";
	let timeInUnit = '1';

	for (const [key, value] of msToTimeUnits.entries()) {
		if (time >= value) {
			timeUnit = key;
			timeInUnit = convertMsToTimeUnits[key as keyof typeof convertMsToTimeUnits](time);
		}
		else break ;
	}
	
	return `${timeInUnit}${timeUnit}`;
}