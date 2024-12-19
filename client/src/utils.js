export function formatName(name) {
  console.log(name);
  const [lastName, rest] = name.split(',').map((part) => part.trim());

  // Extract the first and middle initials
  const [firstName] = rest.split(' ');

  // Return the formatted name
  return `${firstName} ${lastName}`;
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
