const PrayerTimes = require("prayer-times")

let long=-121.95509
let lat=37.35579
let tzone=-8
let prayTimes = new PrayerTimes('ISNA')
let times = prayTimes.getTimes(new Date(), [lat, long], tzone)
console.log('Sunrise : '+ times.sunrise)
console.log(times)


