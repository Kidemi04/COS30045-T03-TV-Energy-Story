document.addEventListener("DOMContentLoaded", async () => {
	const chartIds = ["size-chart", "power-chart", "size-power-chart", "size-star-chart"];
	const chartContainers = chartIds.map((id) => document.getElementById(id)).filter(Boolean);
	if (!chartContainers.length) return;
	const year = document.getElementById("year");
	if (year) year.textContent = new Date().getFullYear();

	const xml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
		"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
	}[char]));
	const number = new Intl.NumberFormat("en-AU");
	const colors = { ink: "#17212b", brown: "#7d6744", orange: "#eba746", line: "#ded8cf", muted: "#52606d" };

	function installSvg(container, title, description, content, viewBox) {
		const box = viewBox || "0 0 900 430";
		container.innerHTML = '<svg viewBox="' + box + '" role="img" aria-label="' + xml(title) + '">' +
			"<title>" + xml(title) + "</title><desc>" + xml(description) + "</desc>" + content + "</svg>";
	}

	function bars(container, items, key, axisLabel, maxValue) {
		const width = 900;
		const rowHeight = key === "inches" ? 33 : 54;
		const height = Math.max(270, 44 + rowHeight * items.length + 54);
		const left = 130;
		const right = 82;
		const top = 18;
		const bottom = 48;
		const plotWidth = width - left - right;
		const plotHeight = height - top - bottom;
		const tickStep = maxValue / 4;
		let content = "";

		for (let tick = 0; tick <= 4; tick += 1) {
			const value = tickStep * tick;
			const x = left + (value / maxValue) * plotWidth;
			content += '<line class="gridline" x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="' + (top + plotHeight) + '" />';
			content += '<text x="' + x + '" y="' + (height - 21) + '" text-anchor="middle">' + number.format(Math.round(value)) + "</text>";
		}

		items.forEach((item, index) => {
			const y = top + index * rowHeight + 5;
			const value = item.count;
			const barWidth = (value / maxValue) * plotWidth;
			const label = key === "inches" ? item.inches + "″" : item.name;
			const fill = index < 2 ? colors.orange : colors.brown;
			content += '<text x="' + (left - 12) + '" y="' + (y + 18) + '" text-anchor="end">' + xml(label) + "</text>";
			content += '<rect x="' + left + '" y="' + y + '" width="' + barWidth + '" height="22" rx="3" fill="' + fill + '" />';
			content += '<text x="' + Math.min(left + barWidth + 8, width - 65) + '" y="' + (y + 17) + '">' + number.format(value) + "</text>";
		});

		content += '<line class="axis" x1="' + left + '" y1="' + top + '" x2="' + left + '" y2="' + (top + plotHeight) + '" />';
		content += '<text class="axis-label" x="' + (left + plotWidth / 2) + '" y="' + (height - 2) + '" text-anchor="middle">' + xml(axisLabel) + "</text>";
		installSvg(container, axisLabel, items.length + " horizontal bars. The first two values are highlighted.", content, "0 0 " + width + " " + height);
	}

	function scatter(container, points, yLabel, correlation, trend) {
		const width = 900;
		const height = 430;
		const margin = { left: 72, right: 24, top: 20, bottom: 66 };
		const plotWidth = width - margin.left - margin.right;
		const plotHeight = height - margin.top - margin.bottom;
		const xs = points.map((point) => point[0]);
		const ys = points.map((point) => point[1]);
		const xMin = Math.floor(Math.min(...xs) / 50) * 50;
		const xMax = Math.ceil(Math.max(...xs) / 50) * 50;
		const yMin = 0;
		const yMax = yLabel.indexOf("rating") >= 0 ? 10 : Math.ceil(Math.max(...ys) / 100) * 100;
		const x = (value) => margin.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
		const y = (value) => margin.top + plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;
		let content = "";

		for (let tick = 0; tick <= 4; tick += 1) {
			const value = xMin + ((xMax - xMin) / 4) * tick;
			const px = x(value);
			content += '<line class="gridline" x1="' + px + '" y1="' + margin.top + '" x2="' + px + '" y2="' + (margin.top + plotHeight) + '" />';
			content += '<text x="' + px + '" y="' + (height - 42) + '" text-anchor="middle">' + Math.round(value) + "</text>";
		}
		for (let tick = 0; tick <= 4; tick += 1) {
			const value = yMin + ((yMax - yMin) / 4) * tick;
			const py = y(value);
			content += '<line class="gridline" x1="' + margin.left + '" y1="' + py + '" x2="' + (margin.left + plotWidth) + '" y2="' + py + '" />';
			content += '<text x="' + (margin.left - 10) + '" y="' + (py + 5) + '" text-anchor="end">' + Number(value.toFixed(1)) + "</text>";
		}

		if (trend) {
			const meanX = xs.reduce((sum, value) => sum + value, 0) / xs.length;
			const meanY = ys.reduce((sum, value) => sum + value, 0) / ys.length;
			const slope = xs.reduce((sum, value, index) => sum + (value - meanX) * (ys[index] - meanY), 0) /
				xs.reduce((sum, value) => sum + (value - meanX) ** 2, 0);
			const intercept = meanY - slope * meanX;
			content += '<line x1="' + x(xMin) + '" y1="' + y(slope * xMin + intercept) + '" x2="' + x(xMax) + '" y2="' + y(slope * xMax + intercept) + '" stroke="' + colors.orange + '" stroke-width="3" />';
		}

		points.forEach(([screenSize, value]) => {
			content += '<circle cx="' + x(screenSize) + '" cy="' + y(value) + '" r="2.2" fill="' + colors.brown + '" fill-opacity="0.22" />';
		});
		content += '<line class="axis" x1="' + margin.left + '" y1="' + (margin.top + plotHeight) + '" x2="' + (margin.left + plotWidth) + '" y2="' + (margin.top + plotHeight) + '" />';
		content += '<line class="axis" x1="' + margin.left + '" y1="' + margin.top + '" x2="' + margin.left + '" y2="' + (margin.top + plotHeight) + '" />';
		content += '<text class="axis-label" x="' + (margin.left + plotWidth / 2) + '" y="' + (height - 8) + '" text-anchor="middle">Screen size (cm)</text>';
		content += '<text class="axis-label" transform="translate(17 ' + (margin.top + plotHeight / 2) + ') rotate(-90)" text-anchor="middle">' + xml(yLabel) + "</text>";
		installSvg(container, yLabel + " by screen size", points.length.toLocaleString("en-AU") + " model records. Pearson correlation r = " + correlation.toFixed(3) + ".", content);
	}

	try {
		const response = await fetch("data/story-data.json");
		if (!response.ok) throw new Error("Dataset request failed (" + response.status + ")");
		const data = await response.json();
		document.querySelectorAll("[data-story-stat='records']").forEach((item) => { item.textContent = number.format(data.rows.australia); });
		document.querySelectorAll("[data-story-stat='brands']").forEach((item) => { item.textContent = number.format(data.brandCount); });
		document.querySelectorAll("[data-story-stat='screen-power-r']").forEach((item) => { item.textContent = data.sizePowerCorrelation.toFixed(3); });
		document.querySelectorAll("[data-story-stat='screen-star-r']").forEach((item) => { item.textContent = data.sizeStarCorrelation.toFixed(3); });
		bars(document.getElementById("size-chart"), data.sizes, "inches", "Available models", Math.ceil(data.sizes[0].count / 100) * 100);
		bars(document.getElementById("power-chart"), data.powerMedian.map((item) => ({ ...item, count: item.median })), "name", "Median average-mode power (W)", Math.ceil(Math.max(...data.powerMedian.map((item) => item.median)) / 25) * 25);
		scatter(document.getElementById("size-power-chart"), data.sizePower, "Average-mode power (W)", data.sizePowerCorrelation, true);
		scatter(document.getElementById("size-star-chart"), data.sizeStar, "Displayed star rating", data.sizeStarCorrelation, false);
	} catch (error) {
		chartContainers.forEach((container) => {
			container.innerHTML = '<p class="story-error">The charts could not load. Open this page from its hosted site or a local web server to view the data.</p>';
		});
		console.error("Unable to load the television story data:", error);
	}
});
