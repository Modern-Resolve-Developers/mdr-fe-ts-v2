import React from 'react';

const ZERO = 0;

export function placeCurrency(
	value?: string,
	currency = 'P',
	location = 'start'
): string {
	if (location.toLowerCase() === 'end') return `${value}${currency}`;

	return `${currency}${location}`;
}

export function toDecimalPlaces(value = 0, decimalPlaces = 2): string {
	try {
		if (isNaN(value)) return ZERO.toFixed(decimalPlaces);
		return value.toFixed(decimalPlaces);
	} catch (e) {
		return `${value}`;
	}
}

export function isANumber(value?: string): boolean {
	try {
		const v = parseFloat(`${value}`);

		if (isNaN(v)) {
			return false;
		}
		return true;
	} catch (e) {
		return false;
	}
}

export function addThousandsSeparator(
	value = 0,
	decimalPlaces = 2,
	separator = ',',
	throwError = false
): string {
	try {
		const v = parseFloat(`${value}`);

		if (isNaN(v)) {
			if (throwError) throw new Error('Unable to parse');
			return ZERO.toFixed(decimalPlaces);
		}
		return v
			.toLocaleString('en-US', {
				minimumFractionDigits: decimalPlaces,
				maximumFractionDigits: decimalPlaces,
			})
			.replace(',', separator);
	} catch (e) {
		if (throwError) throw new Error('Unable to parse');
		return ZERO.toFixed(decimalPlaces);
	}
}

export function regexThousandSeparator (
	value = '',
	decimalPlaces = 2,
	throwError = false
	): string {
		try {
		const sanitized = value.replaceAll(',', '');
		const allNum = sanitized.replace(/[^\d.-]/g, '');
		const re = /^[0-9.\b]+$/;
		const idx = allNum.indexOf('.');
			let wholeNum = allNum;
			let decimal = '';
			let res = allNum;
			
			if (idx != -1) {
				decimal = allNum.slice(idx, idx + (decimalPlaces+1));
				wholeNum = allNum.substring(0, idx);
			} else {
				wholeNum = allNum;
			}

			if (wholeNum === '' || re.test(wholeNum.toString())) {
				wholeNum = wholeNum
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				res = wholeNum + decimal;
			}

			return res;
		} catch (e) {
			if (throwError) throw new Error('Unable to parse');
			return '0.00';
		}

}

type NumberFormatterProps = {
	value?: string;
	decimalPlaces?: number;
	hasThousandsSeparator?: boolean;
	thousandsSeparator?: string;
	currency?: string;
	currencyLocation?: 'start' | 'end';
};

const NumberFormatter: React.FC<NumberFormatterProps> = ({
	value = 0,
	decimalPlaces,
	hasThousandsSeparator,
	thousandsSeparator,
	currency,
	currencyLocation,
}) => {
	let result: any = +value;
	if (hasThousandsSeparator) {
		result = addThousandsSeparator(result, decimalPlaces, thousandsSeparator);
	} else {
		result = toDecimalPlaces(value as number, decimalPlaces);
	}

	if (currency) {
		result = placeCurrency(result, currency, currencyLocation);
	}

	return <>{result}</>;
};

export default NumberFormatter;