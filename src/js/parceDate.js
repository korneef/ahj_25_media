export default function getTicketDate(date) {
  const ticketDate = new Date(date);
  let day = ticketDate.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  let month = ticketDate.getMonth();
  if (month < 10) {
    month = `0${month}`;
  }

  const year = ticketDate.getFullYear();

  let hours = ticketDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = ticketDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
