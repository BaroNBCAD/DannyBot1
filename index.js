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
  "https://raw.githubusercontent.com/BaroNBCAD/DannyBot1/refs/heads/main/";

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
    image: `${GITHUB_BASE}public/card/hiyuki.png`,
  },
  denia: {
    name: "Denia",
    color: "#ff67e8",
    image: `${GITHUB_BASE}/public/card/denia.png`,
  },
};

const materialData = {
  hiyuki: {
    name: "Hiyuki",
    color: "#afeeee",
    image: `${GITHUB_BASE}/public/material/hiyuki.png`,
  },
  denia: {
    name: "Denia",
    color: "#ff67e8",
    image: `${GITHUB_BASE}/public/material/denia.png`,
  },
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
        {
          name: "material",
          description: "Shows the resonator ascension materials selector",
        },
      ]);
      console.log(
        `Slash commands successfully auto-registered to server: ${guild.name}`,
      );
    } else {
      console.log(
        `Warning: Could not find or access any server matching ID: ${guildId}`,
      );
    }
  } catch (error) {
    console.error("❌ Failed to auto-register slash commands:", error);
  }
});
// --- HELPER FUNCTION ---
// --- /build
async function getBuildPage(pageIndex) {
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
    .setCustomId("select_build")
    .setPlaceholder("Choose a Resonator")
    .addOptions(pageItems);

  const row1 = ActionRowBuilder.from({ components: [selectMenu] });

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`prev_build_${pageIndex}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId(`next_build_${pageIndex}`)
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
// --- /material
async function getMaterialPage(pageIndex) {
  const itemsPerPage = 9;
  const totalPages = Math.ceil(characters.length / itemsPerPage);
  const start = pageIndex * itemsPerPage;
  const pageItems = characters.slice(start, start + itemsPerPage);

  const attachment = await generateDynamicGrid(pageItems, pageIndex);

  const embed = new EmbedBuilder()
    .setTitle("Resonator Material Database")
    .setDescription(
      "Select a character below to see their ascension materials.",
    )
    .setImage(`attachment://grid-p${pageIndex}.png`);

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("select_material")
    .setPlaceholder("Choose a Resonator")
    .addOptions(pageItems);

  const row1 = ActionRowBuilder.from({ components: [selectMenu] });
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`prev_material_${pageIndex}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageIndex === 0),
    new ButtonBuilder()
      .setCustomId(`next_material_${pageIndex}`)
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
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "build") {
      try {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const pageData = await getBuildPage(0);
        await interaction.editReply(pageData);
      } catch (error) {
        console.error("Error running /build:", error);
        await interaction
          .editReply({
            content: "An error occurred while loading this build card.",
          })
          .catch(() => null);
      }
    }

    if (interaction.commandName === "material") {
      try {
        await interaction.deferReply({ flags: ["Ephemeral"] });
        const pageData = await getMaterialPage(0);
        await interaction.editReply(pageData);
      } catch (error) {
        console.error("Error running /material:", error);
        await interaction
          .editReply({
            content: "An error occurred while loading these materials.",
          })
          .catch(() => null);
      }
    }
  }

  // 2. Handle Buttons (Next/Prev)
  if (interaction.isButton()) {
    if (interaction.customId === "back_to_build") {
      const pageData = await getBuildPage(0);
      return await interaction.update(pageData);
    }
    if (interaction.customId === "back_to_material") {
      const pageData = await getMaterialPage(0);
      return await interaction.update(pageData);
    }

    const [action, type, currentIndex] = interaction.customId.split("_");
    let newIndex = parseInt(currentIndex);

    if (action === "next") newIndex++;
    if (action === "prev") newIndex--;
    if (type === "build") {
      const pageData = await getBuildPage(newIndex);
      await interaction.update(pageData);
    }
    if (type === "material") {
      const pageData = await getMaterialPage(newIndex);
      await interaction.update(pageData);
    }
  }

  // 3. Handle Select Menu
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "select_build") {
      const charKey = interaction.values[0];
      const data = resonatorData[charKey];

      if (!data) {
        return interaction.reply({
          content: "Loading...",
          flags: ["Ephemeral"],
        });
      }

      const buildEmbed = new EmbedBuilder()
        .setTitle(`${data.name} Build Guide`)
        .setColor(data.color)
        .setImage(data.image);

      const backButton = new ButtonBuilder()
        .setCustomId("back_to_build")
        .setLabel("Return")
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(backButton);

      await interaction.update({
        embeds: [buildEmbed],
        components: [row],
        attachments: [],
      });
    }

    if (interaction.customId === "select_material") {
      const charKey = interaction.values[0];
      const data = materialData[charKey];
      if (!data)
        return interaction.reply({
          content: "Loading...",
          flags: ["Ephemeral"],
        });

      const matEmbed = new EmbedBuilder()
        .setTitle(`${data.name} Material Guide`)
        .setColor(data.color)
        .setImage(data.image);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("back_to_material")
          .setLabel("Return")
          .setStyle(ButtonStyle.Secondary),
      );

      await interaction.update({
        embeds: [matEmbed],
        components: [row],
        attachments: [],
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
