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
        "5:4": [5, 4], // 1.25
        "4:3": [4, 3], // 1.333
        "48:35": [1.37, 1], // 1.37
        "457:333": [457, 333], // 1.372
        "11:8": [11, 8], // 1.375:1
        "A4 (1.414:1)": [1.414, 1],
        "143:100": [143, 100], // 1.43:1
        "3:2": [3, 2], // 1.5
        // "16:10": [16, 10], // 1.6
        "8:5": [8, 5], // 1.6
        "5:3": [5, 3], // 1.66
        "16:9": [16, 9], // 1.7
        "7:4": [7, 4], // 1.75:1
        "37:20": [37, 20], //1.85
        "15:8": [15, 8], // 1.875
        "256:135": [256, 135], // 1.9
        "2:1": [2, 1],
        "11:5": [11, 5], // 2.208:1
        "47:20": [47, 20], // 2.35:1
        "43:8": [43, 8], // 2.39:1
        "7:3": [7, 3], // 2.4:1, 21:9
        "51:20": [51, 20], // 2.55:1
        // 324:125
        "70:27": [70, 27], // 2.592
        "8:3": [8, 3], // 2.6:1
        "69:25": [69, 25], // 2.76:1
        "32:9": [32, 9], // 3.5
        "18:5": [18, 5], // 3.6:1
        "12:1": [12, 1],
        "4:5": [4, 5], // IG portrait
        "1:1": [1, 1], // IG square
        "191:100": [191, 100], // IG landscape
        "9:16": [9, 16], // IGTV portrait
        "12:1": [12, 1]
        // "21:9": [21, 9]
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

        const selectedNumRatio = parseFloat(selectedRatio.split(":")[0]) / parseFloat(selectedRatio.split(":")[1]);
        const actualNumRatio = ratioW / ratioH;
        const megapixels = ((width * height) / 1000000).toFixed(2);

        if (selectedRatio === "unlocked") {
            aspectRatioOutput.classList.add("exact-match");
            aspectRatioOutput.innerHTML = `${width}&times${height} = ${ratioW}:${ratioH} AR (dimensions are divisible by 8) = ${megapixels} MP`;
        } else if (selectedRatio == `${ratioW}:${ratioH}`) {
            aspectRatioOutput.classList.add("exact-match");
            aspectRatioOutput.innerHTML = `${width}&times${height} = ${ratioW}:${ratioH} AR (dimensions are divisible by 8) = ${megapixels} MP`;
        } else {
            aspectRatioOutput.classList.remove("exact-match");
            aspectRatioOutput.innerHTML = `${width}&times${height} = ${ratioW}:${ratioH} AR (approximate for ${aspectRatioSelect.value}, adjusted to ensure dimensions are divisible by 8) = ${megapixels} MP`;
        }
        updateContentSize();
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

        // updateAspectRatio(); // Ensures the width and height are in sync with aspect ratio
        // Manually trigger the input events to ensure other updates happen
        widthInput.dispatchEvent(new Event("input"));
        heightInput.dispatchEvent(new Event("input"));
        updateContentSize(); // Ensures .content reflects changes
        updateFrameSize();   // Ensures .frame reflects changes
    }

    function updateFrameSize() {
        // let frameWidth = parseInt(frameWidthInput.value, 10);
        // let frameHeight = parseInt(frameHeightInput.value, 10);
        // parseInt() ignores decimal values (e.g., 16.5 would be read as 16).
        // parseFloat() allows the frame width and height to retain decimal precision.
        let frameWidth = parseFloat(frameWidthInput.value);
        let frameHeight = parseFloat(frameHeightInput.value);
        let contentWidth = parseInt(widthInput.value, 10);
        let contentHeight = parseInt(heightInput.value, 10);

        if (isNaN(frameWidth) || isNaN(frameHeight) || frameWidth <= 0 || frameHeight <= 0) return;

        let frameRatio = frameWidth / frameHeight;
        let contentRatio = contentWidth / contentHeight;

        // debug
        document.getElementById("frame-ratio-output").textContent = frameRatio;
        document.getElementById("content-ratio-output").textContent = contentRatio;

        const results = document.querySelector(".results");
        if (frameRatio === contentRatio) {
            results.classList.add("exact-match");
        } else {
            results.classList.remove("exact-match");
        }

        frame.style.aspectRatio = `${frameWidth} / ${frameHeight}`;
        updateContentSize();

        if (contentRatio > frameRatio) {
            // Content is wider than frame (letterboxing)
            frame.style.width = "auto";
            frame.style.height = "456px";
            // debug
            document.getElementById("content-ratio-words").textContent = "letterboxed";
        } else if (contentRatio < frameRatio) {
            // Content is taller than frame (pillarboxing)
            frame.style.width = "auto";
            frame.style.height = "auto";
            // debug
            document.getElementById("content-ratio-words").textContent = "pillarboxed";
        } else if (contentRatio === frameRatio) {
            frame.style.width = "auto";
            frame.style.height = "auto";
            document.getElementById("content-ratio-words").textContent = "both ratios match";
        } else {
            frame.style.width = "auto";
            frame.style.height = "auto";
            document.getElementById("content-ratio-words").textContent = "unexpected condition";
        }
    }

    function updateContentSize() {
        // let frameWidth = parseInt(frameWidthInput.value, 10);
        // let frameHeight = parseInt(frameHeightInput.value, 10);
        let frameWidth = parseFloat(frameWidthInput.value);
        let frameHeight = parseFloat(frameHeightInput.value);
        let contentWidth = parseInt(widthInput.value, 10);
        let contentHeight = parseInt(heightInput.value, 10);

        if (isNaN(contentWidth) || isNaN(contentHeight) || contentWidth <= 0 || contentHeight <= 0) return;

        let frameRatio = frameWidth / frameHeight;
        let contentRatio = contentWidth / contentHeight;

        // debug
        document.getElementById("frame-ratio-output").textContent = frameRatio;
        document.getElementById("content-ratio-output").textContent = contentRatio;

        const results = document.querySelector(".results");
        if (frameRatio === contentRatio) {
            results.classList.add("exact-match");
        } else {
            results.classList.remove("exact-match");
        }

        content.style.aspectRatio = `${contentWidth} / ${contentHeight}`;

        if (contentRatio > frameRatio) {
            // Content is wider than frame (letterboxing)
            content.style.width = "100%";
            content.style.height = "auto";
        } else {
            // Content is taller than frame (pillarboxing)
            content.style.width = "auto";
            content.style.height = "100%";
        }

    }

    widthInput.addEventListener("input", updateAspectRatio);
    heightInput.addEventListener("input", updateAspectRatio);
    aspectRatioSelect.addEventListener("change", setAspectRatio);
    frameWidthInput.addEventListener("input", updateFrameSize);
    frameHeightInput.addEventListener("input", updateFrameSize);

    updateFrameSize();
    updateContentSize();


});

// show/hide things
// How This Works:
// 1. Loops through all <option> elements in aspect-ratio-select
// 2. Hides all options first (style.display = "none")
// 3. Shows only the ones that match the selected category from arTypes
// 4. If "all" is selected, it shows all options
// 5. Automatically selects the first visible option
document.addEventListener("DOMContentLoaded", function () {
  const arTypes = document.getElementById("arTypes");
  const arSelect = document.getElementById("aspect-ratio-select");

  if (!arTypes || !arSelect) {
    console.error("One or more elements are missing.");
    return;
  }

  arTypes.addEventListener("change", function () {
    const value = arTypes.value;
    const options = arSelect.querySelectorAll("option");

    options.forEach(option => {
      // Reset all options to hidden first
      option.style.display = "none";

      // Show only options that match the selected category
      if (value === "all" || option.classList.contains(value)) {
        option.style.display = "block";
      }
    });

    // Set the first visible option as the selected one
    const firstVisible = arSelect.querySelector("option[style='display: block;']");
    if (firstVisible) {
      arSelect.value = firstVisible.value;
    }
  });

// drag/drop image
  const dropArea = document.getElementById("dropArea");
  const fileInput = document.getElementById("fileInput");
  const previewImg = document.getElementById("previewImg");
  const contentText = document.getElementById("contentText");

  // Handle file selection
  function handleFiles(files) {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
              previewImg.src = e.target.result;
              previewImg.style.display = "block";
              contentText.style.display = "none";
          };
          reader.readAsDataURL(file);
      }
  }

  // Drag & drop events
  dropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropArea.classList.add("highlight");
      contentText.style.display = "none";
  });

  dropArea.addEventListener("dragleave", () => {
      dropArea.classList.remove("highlight");
      contentText.style.display = "block";
  });

  // Function to reduce aspect ratio to the smallest form
  function simplifyRatio(width, height) {
      function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
      const divisor = gcd(width, height);
      return `${width / divisor}:${height / divisor}`;
  }

  dropArea.addEventListener("drop", (e) => {
      e.preventDefault();
      dropArea.classList.remove("highlight");
      handleFiles(e.dataTransfer.files);
      dropArea.classList.remove("drag-over");

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = (event) => {
              previewImg.src = event.target.result;
              previewImg.style.display = "block"; // Show the image

              // Create an offscreen image to get dimensions
              const img = new Image();
              img.src = event.target.result;
              img.onload = () => {
                const width = img.width;
                const height = img.height;
                const aspectRatio = (img.width / img.height).toFixed(2);
                const simplifiedRatio = simplifyRatio(width, height);
                document.getElementById("aspectRatioText").innerHTML =
                    `Aspect ratio of dropped image = ${simplifiedRatio}, ${aspectRatio}:1 (${width} px W &times; ${height} px H)`;
              };
          };

          reader.readAsDataURL(file);
      }
  });

  // Click to open file dialog
  dropArea.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));
});