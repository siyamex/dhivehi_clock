window.addEventListener("DOMContentLoaded",() => {
	const clock = new ProgressClock("#clock");
});

class ProgressClock {
	constructor(qs) {
		this.el = document.querySelector(qs);
		this.time = 0;
		this.updateTimeout = null;
		this.ringTimeouts = [];
		this.update();
	}
	getDayOfWeek(day) {
		switch (day) {
			case 1:
				return "ހޯމަ";
			case 2:
				return "އަންގާރަ";
			case 3:
				return "ބުދަ";
			case 4:
				return "ބުރާސްފަތި";
			case 5:
				return "ހުކުރު";
			case 6:
				return "ހޮނިހިރު";
			default:
				return "އާދިއްތަ";
		}
	}
	getMonthInfo(mo,yr) {
		switch (mo) {
			case 1:
				return { name: "ފެބްރުއަރީ", days: yr % 4 === 0 ? 29 : 28 };
			case 2:
				return { name: "މާޗް", days: 31 };
			case 3:
				return { name: "އޭޕްރިލް", days: 30 };
			case 4:
				return { name: "މެއި", days: 31 };
			case 5:
				return { name: "ޖޫން", days: 30 };
			case 6:
				return { name: "ޖުލައި", days: 31 };
			case 7:
				return { name: "އޯގަސްޓް", days: 31 };
			case 8:
				return { name: "ސެޕްޓެމްބަރ", days: 30 };
			case 9:
				return { name: "އޮކްޓޯބަރ", days: 31 };
			case 10:
				return { name: "ނޮވެމްބަރ", days: 30 };
			case 11:
				return { name: "ޑިސެމްބަރ", days: 31 };
			default:
				return { name: "ޖަނަވަރީ", days: 31 };
		}
	}
	update() {
		this.time = new Date();

		if (this.el) {
			// date and time
			const dayOfWeek = this.time.getDay();
			const year = this.time.getFullYear();
			const month = this.time.getMonth();
			const day = this.time.getDate();
			const hr = this.time.getHours();
			const min = this.time.getMinutes();
			const sec = this.time.getSeconds();
			const dayOfWeekName = this.getDayOfWeek(dayOfWeek);
			const monthInfo = this.getMonthInfo(month,year);
			const m_progress = sec / 60;
			const h_progress = (min + m_progress) / 60;
			const d_progress = (hr + h_progress) / 24;
			const mo_progress = ((day - 1) + d_progress) / monthInfo.days;
			const units = [
				{
					label: "w",
					value: dayOfWeekName
				},
				{
					label: "mo",
					value: monthInfo.name,
					progress: mo_progress
				},
				{
					label: "d", 
					value: day,
					progress: d_progress
				},
				{
					label: "h", 
					value: hr > 12 ? hr - 12 : hr,
					progress: h_progress
				},
				{
					label: "m", 
					value: min < 10 ? "0" + min : min,
					progress: m_progress
				},
				{
					label: "s", 
					value: sec < 10 ? "0" + sec : sec
				},
				{
					label: "ap",
					value: hr > 12 ? "PM" : "AM"
				}
			];

			// flush out the timeouts
			this.ringTimeouts.forEach(t => {
				clearTimeout(t);
			});
			this.ringTimeouts = [];

			// update the display
			units.forEach(u => {
				// rings
				const ring = this.el.querySelector(`[data-ring="${u.label}"]`);

				if (ring) {
					const strokeDashArray = ring.getAttribute("stroke-dasharray");
					const fill360 = "progress-clock__ring-fill--360";

					if (strokeDashArray) {
						// calculate the stroke
						const circumference = +strokeDashArray.split(" ")[0];
						const strokeDashOffsetPct = 1 - u.progress;

						ring.setAttribute(
							"stroke-dashoffset",
							strokeDashOffsetPct * circumference
						);

						// add the fade-out transition, then remove it
						if (strokeDashOffsetPct === 1) {
							ring.classList.add(fill360);

							this.ringTimeouts.push(
								setTimeout(() => {
									ring.classList.remove(fill360);
								}, 600)
							);
						}
					}
				}

				// digits
				const unit = this.el.querySelector(`[data-unit="${u.label}"]`);

				if (unit)
					unit.innerText = u.value;
			});
		}

		clearTimeout(this.updateTimeout);
		this.updateTimeout = setTimeout(this.update.bind(this),1e3);
	}
}