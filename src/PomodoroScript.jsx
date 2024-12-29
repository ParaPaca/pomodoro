import { format, addMinute, addSecond } from "@formkit/tempo"

const doc = window.document
const date = new Date();

const displayTimer = doc.querySelector('.timer')


displayTimer.innerText += format(date, { time: "short" });
console.log(format(date, { time: "short" }))
function timer() {
}