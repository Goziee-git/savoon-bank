// Convert numbers to words for currency display
export const numberToWords = (num) => {
  if (num === 0) return 'Zero Dollars';
  
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  
  const convertHundreds = (n) => {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred';
      n %= 100;
      if (n > 0) result += ' ';
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) result += '-' + ones[n];
    } else if (n > 0) {
      result += ones[n];
    }
    
    return result;
  };
  
  // Split into dollars and cents
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);
  
  if (dollars === 0) {
    if (cents === 0) return 'Zero Dollars';
    return `${convertHundreds(cents)} Cent${cents !== 1 ? 's' : ''}`;
  }
  
  let result = '';
  let scaleIndex = 0;
  let tempDollars = dollars;
  
  while (tempDollars > 0) {
    const chunk = tempDollars % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex > 0) {
        result = chunkWords + ' ' + scales[scaleIndex] + (result ? ' ' + result : '');
      } else {
        result = chunkWords;
      }
    }
    tempDollars = Math.floor(tempDollars / 1000);
    scaleIndex++;
  }
  
  result += ` Dollar${dollars !== 1 ? 's' : ''}`;
  
  if (cents > 0) {
    result += ` and ${convertHundreds(cents)} Cent${cents !== 1 ? 's' : ''}`;
  }
  
  return result;
};

// Shorter version for display
export const numberToWordsShort = (num) => {
  if (num === 0) return 'Zero Dollars';
  
  const dollars = Math.floor(num);
  const cents = Math.round((num - dollars) * 100);
  
  if (dollars >= 1000000) {
    const millions = (dollars / 1000000).toFixed(1);
    return `${millions} Million Dollars`;
  } else if (dollars >= 1000) {
    const thousands = (dollars / 1000).toFixed(1);
    return `${thousands} Thousand Dollars`;
  } else {
    return numberToWords(num);
  }
};
