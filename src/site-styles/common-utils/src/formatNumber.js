import { format } from 'd3-format';

const numberFormatter = format(',.1f');

/*
  Format number

  Returns the number rendered as a string according to Fairfax style, or close to it.

  @param { Number } number - Number to be formatted
*/

export default function formatNumber(number) {
  if (+number >= 10000) {
    return numberFormatter(number).replace(/\..*0$/, '');
  } else {
    return number.toFixed(2).replace(/\..*0$/, '');
  }
}
