# Aspect Ratio Calculator

A JavaScript-based aspect ratio calculator that helps users determine and adjust resolutions while ensuring dimensions are evenly divisible by 8. The tool also includes a framing feature that compares content against different frame sizes. This simulated visual output can also possibly help people who don't intuitively understand aspect ratios, cropping (not shown but i hope the frame vs content boxes visual would be enough as it is), letterboxing, and pillarboxing concepts.

## demonstration video
[![video thumbnail](jsarc-video-thumb.png)](https://youtu.be/2_xbtJFZ1QY
 "js aspect ratio calculator demonstration")

## Features
- **Aspect Ratio Selection**: Choose from a predefined list of common aspect ratios (e.g., 4:3, 16:9, 21:9) or custom/unlocked via the drop-down menu.
- **Dynamic Resolution Adjustment**: Updates width and height values while maintaining the selected aspect ratio.
- **Divisibility by 8**: Ensures all calculated dimensions are evenly divisible by 8 - this helps to optimize videos and images for compression algorithms and hardware processing.
- **Frame Comparison**: Allows users to enter a frame size and see how content fits within it - your monitor, TV, and phone displays count as a "frame" in this context.
- **Real-time Feedback**: Displays calculated aspect ratios, frame ratios, and content-to-frame fit status (letterboxed, pillarboxed, or exact match).

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sean1138/aspect-ratio-calc.git
   ```
2. Open `index.html` in a web browser.

## Usage
1. Select an aspect ratio from the dropdown menu.
2. Adjust the content width or height—changes will automatically update the other value to maintain the ratio.
3. Modify the frame width and height to compare content fit.
4. View real-time simulated visual representation, ratio calculations, and fit status.

## Customization
- Modify the `aspectRatios` object in `aspect-ratio-calc.js` to add new aspect ratios.
- Adjust styling in `styles.css` to customize the UI.

## License
This project is open-source and available under the GPL-3.0 license.

## Credits
1. ChatGPT handled most of the javascript and gave me a draft readme to work with.
2. [pico.css](https://picocss.com/) because I didn't feel like writing any and i like the basic idea behind the pico repo.