document.addEventListener("DOMContentLoaded", function () {
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const aspectRatioOutput = document.getElementById("aspect-ratio");
    const aspectRatioSelect = document.getElementById("aspect-ratio-select");
    const frameWidthInput = document.getElementById("frame-width");
    const frameHeightInput = document.getElementById("frame-height");
    const frame = document.querySelector(".frame");
    const content = document.querySelector(".content");

    const aspectRatios = {
        "1:2.32": [1, 2.32],
        "4:3": [4, 3],
        "5:4": [5, 4],
        "11:8": [11, 8],
        "16:9": [16, 9],
        "21:9": [21, 9],
        "1.85:1": [1.85, 1],
        "2.39:1": [2.39, 1],
        "A4 (1.414:1)": [1.414, 1]
    };

    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }

    function updateAspectRatio(event) {
        let width = parseInt(widthInput.value, 10);
        let height = parseInt(heightInput.value, 10);

        if (isNaN(width) || isNaN(height)) {
            aspectRatioOutput.textContent = "Enter valid numbers";
            return;
        }

        if (width % 8 !== 0 || height % 8 !== 0) {
            aspectRatioOutput.textContent = "Both dimensions must be divisible by 8";
            return;
        }

        let selectedRatio = aspectRatioSelect.value;
        if (aspectRatios[selectedRatio]) {
            let [ratioW, ratioH] = aspectRatios[selectedRatio];

            if (event.target === widthInput) {
                height = Math.round((width / ratioW) * ratioH);
                if (height % 8 !== 0) height += 8 - (height % 8);
                heightInput.value = height;
            } else if (event.target === heightInput) {
                width = Math.round((height / ratioH) * ratioW);
                if (width % 8 !== 0) width += 8 - (width % 8);
                widthInput.value = width;
            }
        }

        let divisor = gcd(width, height);
        let ratioW = width / divisor;
        let ratioH = height / divisor;

        aspectRatioOutput.textContent = `Calculated: ${ratioW}:${ratioH} (approximate for ${aspectRatioSelect.value}, adjusted to ensure dimensions are divisible by 8)`;

        updateContentSize();
        // updateFrameSize();
    }

    function setAspectRatio() {
        let selectedRatio = aspectRatioSelect.value;
        if (!aspectRatios[selectedRatio]) return;

        let [ratioW, ratioH] = aspectRatios[selectedRatio];
        let baseWidth = 800;
        let baseHeight = Math.round((baseWidth / ratioW) * ratioH);

        if (baseWidth % 8 !== 0) baseWidth += 8 - (baseWidth % 8);
        if (baseHeight % 8 !== 0) baseHeight += 8 - (baseHeight % 8);

        widthInput.value = baseWidth;
        heightInput.value = baseHeight;
        updateAspectRatio();
    }

    function updateFrameSize() {
        let frameWidth = parseInt(frameWidthInput.value, 10);
        let frameHeight = parseInt(frameHeightInput.value, 10);
        let contentWidth = parseInt(widthInput.value, 10);
        let contentHeight = parseInt(heightInput.value, 10);

        if (isNaN(frameWidth) || isNaN(frameHeight) || frameWidth <= 0 || frameHeight <= 0) return;

        let frameRatio = frameWidth / frameHeight;
        let contentRatio = contentWidth / contentHeight;

        // debug
        document.getElementById("frame-ratio-output").textContent = frameRatio;
        document.getElementById("content-ratio-output").textContent = contentRatio;

        frame.style.aspectRatio = `${frameWidth} / ${frameHeight}`;
        updateContentSize();

        if (contentRatio > frameRatio) {
            // Content is wider than frame (pillarboxing)
            frame.style.width = "auto";
            frame.style.height = "456px";
        } else {
            // Content is taller than frame (letterboxing)
            frame.style.width = "800px";
            frame.style.height = "auto";
        }
    }

    function updateContentSize() {
        let frameWidth = parseInt(frameWidthInput.value, 10);
        let frameHeight = parseInt(frameHeightInput.value, 10);
        let contentWidth = parseInt(widthInput.value, 10);
        let contentHeight = parseInt(heightInput.value, 10);

        if (isNaN(contentWidth) || isNaN(contentHeight) || contentWidth <= 0 || contentHeight <= 0) return;

        let frameRatio = frameWidth / frameHeight;
        let contentRatio = contentWidth / contentHeight;

        // debug
        document.getElementById("frame-ratio-output").textContent = frameRatio;
        document.getElementById("content-ratio-output").textContent = contentRatio;

        content.style.aspectRatio = `${contentWidth} / ${contentHeight}`;

        if (contentRatio > frameRatio) {
            // Content is wider than frame (pillarboxing)
            content.style.width = "100%";
            content.style.height = "auto";
        } else {
            // Content is taller than frame (letterboxing)
            content.style.width = "auto";
            content.style.height = "100%";
        }
        // updateFrameSize();
    }

    widthInput.addEventListener("input", updateAspectRatio);
    heightInput.addEventListener("input", updateAspectRatio);
    aspectRatioSelect.addEventListener("change", setAspectRatio);
    frameWidthInput.addEventListener("input", updateFrameSize);
    frameHeightInput.addEventListener("input", updateFrameSize);

    updateFrameSize();
    updateContentSize();
});
