const { createCanvas, loadImage } = require("canvas");
const { AttachmentBuilder } = require("discord.js");
module.exports = { generateDynamicGrid };

async function generateDynamicGrid(characterList, pageIndex) {
  const iconSize = 200; // Size of each character square
  const padding = 10; // Space between icons
  const canvasWidth = iconSize * 3 + padding * 4;
  const canvasHeight = iconSize * 3 + padding * 4;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Fill background (optional, can match Discord's theme)
  ctx.fillStyle = "#2b2d31";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < characterList.length; i++) {
    const char = characterList[i];
    // Calculate grid position
    const col = i % 3;
    const row = Math.floor(i / 3);

    const x = padding + col * (iconSize + padding);
    const y = padding + row * (iconSize + padding);

    try {
      // Load the icon from your GitHub
      const iconUrl = `https://raw.githubusercontent.com/BaroNBCAD/DannyBot1/refs/heads/main/public/IconRoleHead256/${char.value}.png`;
      const image = await loadImage(iconUrl);

      // Draw character icon
      ctx.drawImage(image, x, y, iconSize, iconSize);

      // Draw character name label
      ctx.fillStyle = "white";
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(char.label, x + iconSize / 2, y + iconSize - 10);
    } catch (e) {
      console.error(`Failed to load image for ${char.label}`);
    }
  }

  // Convert canvas to a Discord attachment
  return new AttachmentBuilder(canvas.toBuffer(), {
    name: `grid-p${pageIndex}.png`,
  });
}
