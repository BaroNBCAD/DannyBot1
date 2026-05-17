const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  Events,
} = require("discord.js");
const { generateDynamicGrid } = require("./gridGenerator.js");
require("dotenv").config();
const GITHUB_BASE =
  "https://raw.githubusercontent.com/BaroNBCAD/DannyBot1/main/";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// HOSTINGER
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) =>
  res.send("DannyBot1 is running natively on Hostinger..."),
);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const characters = [
  { label: "Denia", value: "denia" },
  { label: "Hiyuki", value: "hiyuki" },
  // { label: "Sigrika", value: "sigrika" },
  // { label: "Aemeath", value: "aemeath" },
  // { label: "Luuk-Herssen", value: "luuk_herssen" },
  // { label: "Lynae", value: "lynae" },
  // { label: "Mornye", value: "mornye" },
  // { label: "Buling", value: "buling" },
  // { label: "Chisa", value: "chisa" },
  // { label: "Galbrena", value: "galbrena" },
  // { label: "Qiuyuan", value: "qiuyuan" },
  // { label: "Augusta", value: "augusta" },
  // { label: "Iuno", value: "iuno" },
  // { label: "Phrolova", value: "phrolova" },
  // { label: "Cartethyia", value: "cartethyia" },
  // { label: "Lupa", value: "lupa" },
  // { label: "Ciaccona", value: "ciaccona" },
  // { label: "Zani", value: "zani" },
  // { label: "Cantarella", value: "cantarella" },
  // { label: "Rover-Aero", value: "rover_aero" },
  // { label: "Brant", value: "brant" },
  // { label: "Phoebe", value: "phoebe" },
  // { label: "Carlotta", value: "carlotta" },
  // { label: "Roccia", value: "roccia" },
  // { label: "Camellya", value: "camellya" },
  // { label: "Lumi", value: "lumi" },
  // { label: "Shorekeeper", value: "shorekeeper" },
  // { label: "Youhu", value: "youhu" },
  // { label: "Xiangli-Yao", value: "xiangli_yao" },
  // { label: "Zhezhi", value: "zhezhi" },
  // { label: "Changli", value: "changli" },
  // { label: "Jinhsi", value: "jinhsi" },
  // { label: "Aalto", value: "aalto" },
  // { label: "Baizhi", value: "baizhi" },
  // { label: "Calcharo", value: "calcharo" },
  // { label: "Chixia", value: "chixia" },
  // { label: "Danjin", value: "danjin" },
  // { label: "Encore", value: "encore" },
  // { label: "Jianxin", value: "jianxin" },
  // { label: "Jiyan", value: "jiyan" },
  // { label: "Lingyang", value: "lingyang" },
  // { label: "Mortefi", value: "mortefi" },
  // { label: "Rover-Havoc", value: "rover_havoc" },
  // { label: "Rover-Spectro", value: "rover_spectro" },
  // { label: "Sanhua", value: "sanhua" },
  // { label: "Taoqi", value: "taoqi" },
  // { label: "Verina", value: "verina" },
  // { label: "Yangyang", value: "yangyang" },
  // { label: "Yinlin", value: "yinlin" },
  // { label: "Yuanwu", value: "yuanwu" },
];

const resonatorData = {
  hiyuki: {
    name: "Hiyuki",
    color: "#afeeee",
    image:
      "https://raw.githubusercontent.com/BaroNBCAD/DannyBot1/refs/heads/main/public/card/hiyuki.png",
  },
  denia: {
    name: "Denia",
    color: "#fac73b",
    image:
      "https://raw.githubusercontent.com/BaroNBCAD/DannyBot1/refs/heads/main/public/card/denia.png",
  },
  // Add others as you go...
};

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ ${c.user.tag} is online!`);

  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      console.log(
        "⚠️ Warning: GUILD_ID is completely missing in your environment setup!",
      );
      return;
    }

    const guild = await c.guilds.fetch(guildId).catch(() => null);

    if (guild) {
      await guild.commands.set([
        {
          name: "build",
          description: "Shows the resonator build selector",
        },
      ]);
      console.log(
        `⚡ Slash commands successfully auto-registered to server: ${guild.name}`,
      );
    } else {
      console.log(
        `⚠️ Warning: Could not find or access any server matching ID: ${guildId}`,
      );
    }
  } catch (error) {
    console.error("❌ Failed to auto-register slash commands:", error);
  }
});
// --- HELPER FUNCTION ---
async function getPage(pageIndex) {
  const itemsPerPage = 9;
  const totalPages = Math.ceil(characters.length / itemsPerPage);
  const start = pageIndex * itemsPerPage;
  const pageItems = characters.slice(start, start + itemsPerPage);

  const attachment = await generateDynamicGrid(pageItems, pageIndex);

  const embed = new EmbedBuilder()
    .setTitle("Resonator Build Database")
    .setDescription("Select a character below to see their optimal build.")
    .setImage(`attachment://grid-p${pageIndex}.png`);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("select_resonator")
    .setPlaceholder("Choose a Resonator")
    .addOptions(pageItems);

  const row1 = ActionRowBuilder.from({ components: [selectMenu] });

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`prev_${pageIndex}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId(`next_${pageIndex}`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(pageIndex >= totalPages - 1),
  );

  return {
    embeds: [embed],
    files: [attachment],
    components: [row1, row2],
    flags: ["Ephemeral"],
  };
}

// --- MAIN LOGIC ---
client.on(Events.InteractionCreate, async (interaction) => {
  console.log(
    `Interaction received: ${interaction.type} from ${interaction.user.tag}`,
  );
  // 1. Handle Slash Command
  if (interaction.isChatInputCommand() && interaction.commandName === "build") {
    console.log(
      "/build command detected! Attempting to generate layout canvas...",
    );
    try {
      const pageData = await getPage(0);
      console.log(
        "📦 pageData generated successfully. Sending package to Discord...",
      );

      await interaction.reply(pageData);
      console.log("✅ Response successfully dispatched to Discord!");
    } catch (error) {
      console.error("❌ CRITICAL ERROR inside /build handler:", error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction
          .reply({
            content:
              "An internal error occurred while generating this build graphic.",
            flags: ["Ephemeral"],
          })
          .catch(() => null);
      }
    }
  }

  // 2. Handle Buttons (Next/Prev)
  if (interaction.isButton()) {
    if (interaction.customId === "back_to_menu") {
      const pageData = await getPage(0);
      return await interaction.update(pageData);
    }

    const [action, currentIndex] = interaction.customId.split("_");
    let newIndex = parseInt(currentIndex);

    if (action === "next") newIndex++;
    if (action === "prev") newIndex--;
    const pageData = await getPage(newIndex);
    await interaction.update(pageData);
  }

  // 3. Handle Select Menu
  if (
    interaction.isStringSelectMenu() &&
    interaction.customId === "select_resonator"
  ) {
    const charKey = interaction.values[0];
    const data = resonatorData[charKey];

    if (!data) {
      return interaction.reply({
        content: "Build data for this character is coming soon!",
        flags: ["Ephemeral"],
      });
    }

    const buildEmbed = new EmbedBuilder()
      .setTitle(`${data.name} Build Guide`)
      .setColor(data.color)
      .setImage(data.image);

    const backButton = new ButtonBuilder()
      .setCustomId("back_to_menu")
      .setLabel("Return")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(backButton);

    await interaction.update({
      embeds: [buildEmbed],
      components: [row],
      attachments: [],
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
