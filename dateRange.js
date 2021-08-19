function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
}
module.exports = dateRange