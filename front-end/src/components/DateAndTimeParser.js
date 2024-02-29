function parseDate(fullDate)
{
    let date = new Date(fullDate);

    let data = {
        hour: date.getHours().toString().padStart(2, '0'),
        minutes: date.getMinutes().toString().padEnd(2, '0'),
        day: date.getDate().toString().padStart(2, '0'),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        year: date.getFullYear()
    };

    return data;
}

export default parseDate;