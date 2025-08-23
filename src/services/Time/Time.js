
export function convertToLocalTime(data) {
    //console.log("convertToLocalTime")
    return data.map((item) => {
        const spendDateTimeLocal = convertUTCToLocalTime(item.spendDateTime);
        const entryDateTimeLocal = convertUTCToLocalTime(item.entryDateTime);

        return {
            ...item,
            spendDateTime: spendDateTimeLocal,
            entryDateTime: entryDateTimeLocal
        };
    });
}
export function convertUTCToLocalTime(utcString) {
    //console.log("convertUTCToLocalTime")

    const date = new Date(utcString); // Parse the UTC date string
    date.setHours(date.getHours() + 5); // Add 5 hours
    date.setMinutes(date.getMinutes() + 30); // Add 30 minutes
    return date.toISOString().replace('Z', '');
}
export function convertISTtoUTC(dateStr) {
    // Parse the string as IST (Indian Standard Time is UTC+5:30)
    const [datePart, timePart] = dateStr.includes("T")
        ? dateStr.split("T")
        : dateStr.split(" ")
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Create a Date object, assuming it's in IST
    const dateIST = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));

    // Format the Date object to UTC in the desired format
    const utcYear = dateIST.getUTCFullYear();
    const utcMonth = String(dateIST.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(dateIST.getUTCDate()).padStart(2, "0");
    const utcHour = String(dateIST.getUTCHours()).padStart(2, "0");
    const utcMinute = String(dateIST.getUTCMinutes()).padStart(2, "0");
    const utcSecond = String(dateIST.getUTCSeconds()).padStart(2, "0");
    const utcMilliseconds = String(dateIST.getUTCMilliseconds()).padStart(3, "0");

    // Construct the final formatted string
    return `${utcYear}-${utcMonth}-${utcDay}T${utcHour}:${utcMinute}:${utcSecond}.${utcMilliseconds}+00:00`;
}

export function convertISTtoUTCReturnDate(dateStr) {
    const [datePart, timePart] = dateStr.includes("T")
        ? dateStr.split("T")
        : dateStr.split(" ");
    const [year, month, day] = datePart?.split("-").map(Number);
    const [hour, minute] = timePart?.split(":").map(Number);

    // Create a Date object, assuming it's in IST (UTC+5:30)
    const dateIST = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));

    return dateIST;  // Return Date object in UTC
}

export const CheckIfSameDateTime =(date1,date2)=>{
    function isSameDateTime(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate() &&
            date1.getHours() === date2.getHours() &&
            date1.getMinutes() === date2.getMinutes()
        );
    }
    let d1= new Date(date1)
    let d2= new Date(date2)
    let dddd= isSameDateTime(d1,d2)
    return dddd
}

export const getDateWithAddedHour=()=> {
    const date = new Date();
    date.setHours(date.getHours() + 1); // Add 1 hour

    return date.toLocaleString('sv-SE').slice(0, 16);
}

export const getXMonthAgoDateTime=(month)=>{
    const now = new Date();
    const xmonthAgo = new Date();
    xmonthAgo.setMonth(now.getMonth() - month);
    return xmonthAgo.toLocaleString('sv-SE').slice(0, 16)
}