/* eslint-disable require-jsdoc */
function formatName(name) {
  const [lastName, rest] = name.split(',').map((part) => part.trim());

  // Extract the first and middle initials
  const [firstName] = rest.split(' ');

  // Return the formatted name
  return `${firstName} ${lastName}`;
}

function formatPhoneNumber(phone) {
  if (!phone.startsWith('+')) {
    return `+1${phone.replace(/\D/g, '')}`;
  }
  return phone.replace(/\D/g, '');
}

module.exports = {
  formatName,
  formatPhoneNumber,
};
