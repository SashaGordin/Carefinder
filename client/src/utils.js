export function formatName(name) {
    console.log(name);
	const [lastName, rest] = name.split(',').map(part => part.trim());

    // Extract the first and middle initials
    const [firstName] = rest.split(' ');

    // Return the formatted name
    return `${firstName} ${lastName}`;
}

export function formatPrice(price) {
	return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}