import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const selectDateInput = document.querySelector("#datetime-picker");
const startBtn = document.querySelector('button[data-start]');

const elements = {
	days: document.querySelector('span[data-days]'),
	hours: document.querySelector('span[data-hours]'),
	minutes: document.querySelector('span[data-minutes]'),
	seconds: document.querySelector('span[data-seconds]'),
};

let userSelectedDates;
let timerInterval;

startBtn.setAttribute("disabled", "");


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
	onClose(selectedDates) {
		userSelectedDates = selectedDates[0];
		
	  if (userSelectedDates <= new Date().getTime()) {
		  startBtn.setAttribute("disabled", "");
		  iziToast.error({ message: "Please choose a date in the future" });
		}
	  else {
		  startBtn.removeAttribute("disabled");
		  iziToast.destroy();

		startBtn.style.cssText =
			`background-color: #4e75ff;
		  	color: #fff`;
		buttonHover("#6C8CFF", "#4e75ff");
		}
		// console.log(selectedDates[0]);
	}
};

flatpickr(selectDateInput, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function buttonHover(backgroundColor, textColor) {
	startBtn.addEventListener("mouseover", () => {
		startBtn.style.backgroundColor = `${backgroundColor}`
		});
	startBtn.addEventListener("mouseout", () => {
		startBtn.style.backgroundColor = `${textColor}`
		});
	}
	
function updateTimer({days, hours, minutes, seconds}) {
	elements.days.textContent = addLeadingZero(days);
	elements.hours.textContent = addLeadingZero(hours);
	elements.minutes.textContent = addLeadingZero(minutes);
	elements.seconds.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener("click", () => {
	startBtn.setAttribute("disabled", "");    // startBtn.disabled = true;
	selectDateInput.disabled = true;
	
	startBtn.removeAttribute("style");

	buttonHover("", "");

	timerInterval = setInterval(() => {
		const currentTime = new Date().getTime();
		const timeLeftToSelectedDate = userSelectedDates - currentTime;

		if (timeLeftToSelectedDate <= 0) {
			clearInterval(timerInterval);
			updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
			selectDateInput.removeAttribute("disabled");
			return;
		}

		const timeConvert = convertMs(timeLeftToSelectedDate);
		updateTimer(timeConvert);
	}, 1000);
});
