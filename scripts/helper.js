export class Time {
    constructor() {
        this.week = {
            "sunday": 0,
            "monday": 1,
            "tuesday": 2,
            "wednesday": 3,
            "thursday": 4,
            "friday": 5,
            "saturday": 6,
        };
    }

    getCurrentDateInfo() {
        const currentDate = new Date();

        return {
            fullDate: currentDate,
            day: currentDate.getDay(),
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            hours: currentDate.getHours(),
            minutes: currentDate.getMinutes(),
            seconds: currentDate.getSeconds(),
            milliseconds: currentDate.getMilliseconds(),
        };
    }
    calcRemainingDays(finishDate, finishDay, currentDate) {
        let daysRemaining;

        if (currentDate.day < finishDay) {
            daysRemaining = finishDay - currentDate.day;
        } else if (currentDate.day === finishDay) {
            if (currentDate.day > finishDate) {
                daysRemaining = 7;
            } else {
                daysRemaining = 0;
            }
        } else {
            daysRemaining = 7 - (currentDate.day - finishDay);
        }

        return daysRemaining;
    }
    getEndDate(endDay, endTime = "23:59") {
        const currentDate = this.getCurrentDateInfo();
        const [hours, minutes] = endTime.split(":").map(Number);
        const finishDay = this.week[endDay];
        const finishDate = new Date(currentDate.fullDate);
        finishDate.setHours(hours);
        finishDate.setMinutes(minutes);
        finishDate.setSeconds(0);
        finishDate.setMilliseconds(0);

        const daysRemaining = this.calcRemainingDays(finishDate, finishDay, currentDate);

        finishDate.setDate(currentDate.date + daysRemaining);

        return finishDate;
    }
}
