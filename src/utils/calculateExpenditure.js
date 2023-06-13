import moment from 'moment';

function getexpenditureKeys(dateTimeObj, dateKey) {
    // var dateKey = dateTimeObj.format('YYMMDD')
    var weeklyKey = getMonday(dateTimeObj)
    // let currDate = moment(dateTimeObj).utcOffset('+5:30')
    var monthlyKey = dateTimeObj.format("YYMM")
    var yearlyKey = dateTimeObj.format("YYYY")
    // console.warn(weeklyKey, monthlyKey, yearlyKey)
    var res = {
        dateKey,
        weeklyKey,
        monthlyKey,
        yearlyKey,
    }
    return res
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    d.setDate(diff); 
    var res = moment(d).format('YYMMDD')
    return res
}

module.exports = {
    getexpenditureKeys
}