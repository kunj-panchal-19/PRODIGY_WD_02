var hr = 0, min = 0, sec = 0, cnt = 0;
var timer = false;
let music = new Audio("./stopwatch.mp3");

var lapTimes = [];
var currentLapPage = 0;
const LAPS_PER_PAGE = 10;

function start() {
    timer = true;
    stopwatch();
    music.play();

    document.getElementById("Start").disabled = true;
    document.getElementById("Stop").disabled = false;
    document.getElementById("Reset").disabled = false;
    document.getElementById("Lap").disabled = false;
}

function stop() {
    timer = false;
    music.pause();

    document.getElementById("Start").disabled = false;
    document.getElementById("Stop").disabled = true;
    document.getElementById("Lap").disabled = true;
}

function reset() {
    timer = false;
    music.pause();
    hr = 0;
    min = 0;
    sec = 0;
    cnt = 0;

    document.getElementById("hr").innerHTML = "00";
    document.getElementById("min").innerHTML = "00";
    document.getElementById("sec").innerHTML = "00";
    document.getElementById("count").innerHTML = "00";

    lapTimes = [];
    currentLapPage = 0;
    updateLapList();

    document.getElementById("Start").disabled = false;
    document.getElementById("Stop").disabled = true;
    document.getElementById("Reset").disabled = true;
    document.getElementById("Lap").disabled = true;
    document.getElementById("PrevLap").disabled = true;
    document.getElementById("NextLap").disabled = true;
}

function lap() {
    if (timer) {
        let currentTime = `${formatTime(hr)}:${formatTime(min)}:${formatTime(sec)}:${formatTime(cnt)}`;
        let previousTime = lapTimes.length ? lapTimes[lapTimes.length - 1].time : "00:00:00:00";
        let lapTimeDifference = getTimeDifference(previousTime, currentTime);
        lapTimes.push({ time: currentTime, difference: lapTimeDifference });
        updateLapList();

        document.getElementById("PrevLap").disabled = currentLapPage == 0;
        document.getElementById("NextLap").disabled = (currentLapPage + 1) * LAPS_PER_PAGE >= lapTimes.length;
    }
}

function prevLap() {
    if (currentLapPage > 0) {
        currentLapPage--;
        updateLapList();
    }

    document.getElementById("PrevLap").disabled = currentLapPage == 0;
    document.getElementById("NextLap").disabled = (currentLapPage + 1) * LAPS_PER_PAGE >= lapTimes.length;
}

function nextLap() {
    if ((currentLapPage + 1) * LAPS_PER_PAGE < lapTimes.length) {
        currentLapPage++;
        updateLapList();
    }

    document.getElementById("PrevLap").disabled = currentLapPage == 0;
    document.getElementById("NextLap").disabled = (currentLapPage + 1) * LAPS_PER_PAGE >= lapTimes.length;
}

function updateLapList() {
    let lapList = document.getElementById("lapList");
    lapList.innerHTML = "";
    let start = currentLapPage * LAPS_PER_PAGE;
    let end = Math.min(start + LAPS_PER_PAGE, lapTimes.length);

    for (let i = start; i < end; i++) {
        let lapItem = document.createElement("div");
        lapItem.className = "lap-item";
        lapItem.innerHTML = `<span>Lap ${i + 1}: ${lapTimes[i].time}</span><span>Diff: ${lapTimes[i].difference}</span>`;
        lapList.appendChild(lapItem);
    }
}

function formatTime(value) {
    return value < 10 ? "0" + value : value;
}

function getTimeDifference(previous, current) {
    let [prevHr, prevMin, prevSec, prevCnt] = previous.split(":").map(Number);
    let [currHr, currMin, currSec, currCnt] = current.split(":").map(Number);

    let prevTotal = (prevHr * 3600 * 100) + (prevMin * 60 * 100) + (prevSec * 100) + prevCnt;
    let currTotal = (currHr * 3600 * 100) + (currMin * 60 * 100) + (currSec * 100) + currCnt;
    let diffTotal = currTotal - prevTotal;

    let diffHr = Math.floor(diffTotal / (3600 * 100));
    diffTotal %= (3600 * 100);
    let diffMin = Math.floor(diffTotal / (60 * 100));
    diffTotal %= (60 * 100);
    let diffSec = Math.floor(diffTotal / 100);
    let diffCnt = diffTotal % 100;

    return `${formatTime(diffHr)}:${formatTime(diffMin)}:${formatTime(diffSec)}:${formatTime(diffCnt)}`;
}

function stopwatch() {
    if (timer) {
        cnt++;
        if (cnt == 100) {
            sec++;
            cnt = 0;
        }
        if (sec == 60) {
            min++;
            sec = 0;
        }
        if (min == 60) {
            hr++;
            min = 0;
        }

        document.getElementById("hr").innerHTML = formatTime(hr);
        document.getElementById("min").innerHTML = formatTime(min);
        document.getElementById("sec").innerHTML = formatTime(sec);
        document.getElementById("count").innerHTML = formatTime(cnt);

        setTimeout(stopwatch, 10);
    }
}
