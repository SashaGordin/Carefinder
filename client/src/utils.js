export function formatName(name) {
  if (!name) {
    return 'UTILS formatName() Error: No name passed to this funciton.'; // or return 'N/A' or whatever
  }

  console.log('UTILS Formatting name:', name);

  try {
    const [lastName, rest] = name.split(',').map((part) => part.trim());

    // Check if rest exists before splitting
    if (!rest) {
      return lastName; // Return just the lastName if there's no rest
    }

    const [firstName] = rest.split(' ');

    return `${firstName} ${lastName}`;
  } catch (error) {
    console.error('UTILS Error formatting name:', error, 'Input:', name);
    return name; // Return original name if formatting fails
  }
}

export function formatPrice(price) {
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function isValidUrl(urlString) {
  var urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
}
