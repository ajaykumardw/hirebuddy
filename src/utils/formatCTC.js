export const formatToLacOrCr = (number) => {
  // Check if the number is greater than or equal to 1 Crore
  if (number >= 10000000) {
    // Convert to Crore (divide by 10,000,000)
    const valueInCrore = number / 10000000;

    // Format the value using `Intl.NumberFormat`
    const formattedValue = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2, // Limit to 2 decimal places
    }).format(valueInCrore);

    return `${formattedValue} Cr`; // Append "Cr" for Crore
  } else if (number >= 100000) {
    // Convert to Lakh (divide by 100,000)
    const valueInLakh = number / 100000;

    // Format the value using `Intl.NumberFormat`
    const formattedValue = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2, // Limit to 2 decimal places
    }).format(valueInLakh);

    return `${formattedValue} Lac`; // Append "Lac" for Lakh
  } else {
    // For values less than 1 Lakh, simply return the number formatted with commas
    return new Intl.NumberFormat("en-IN").format(number);
  }
};

// Helper function to format CTC as required (with commas for thousands)
export const formatCTC = (value) => {
  // Remove all non-numeric characters except for the dot (decimal separator)
  const numericValue = value.replace(/[^0-9.]/g, '');

  // Ensure that only one decimal point exists
  const formattedValue = numericValue.replace(/(\..*?)\..*/g, '$1');

  // Split the value into integer and decimal parts
  const [integer, decimal] = formattedValue.split('.');

  // Format the integer part with commas for thousands, lakhs, and crores (Indian system)
  const integerFormatted = integer ? parseInt(integer).toLocaleString('en-IN') : '';

  // If there's a decimal part, limit to 2 digits after the decimal point
  const decimalFormatted = decimal ? `.${decimal.substring(0, 2)}` : '';

  // Return the formatted CTC with commas for thousands and a decimal point
  return integerFormatted + decimalFormatted;
}
