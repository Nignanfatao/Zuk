const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const {getThemeInfoById , getThemeChoice} = require("../bdd/theme");

zokou({ nomCom: "menu", categorie: "Général" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic,auteurMessage} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//zokou");
    var coms = {};
    var mode = "public";
    
    if (s.MODE != "oui") {
        mode = "privé";
    }

    let id = await getThemeChoice() ;
const imagemenu = await getThemeInfoById(id) ;
const {auteur, liens, nom} = imagemenu
    

    cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
*╔═════ •✧✧• ════╗*
┃   *Préfixe* : ${s.PREFIXE}
┃   *Owner* : ${s.NOM_OWNER}
┃   *Mode* : ${mode}
┃   *Theme* : ${nom}
┃   *Commandes* : ${cm.length}
┃   *Date* : ${date}
┃   *Heure* : ${temps}
┃   *Mémoire* : ${format(os.totalmem() - os.freemem())}/${format(os.totalmem())}
┃   *Plateforme* : ${os.platform()}
┃   *Développeurs* : Djalega++ 
┃  & M๏𝓷keℽ D Lบffy
*╚═════ •✧✧• ════╝* \n\n`;
    
let menuMsg = `
👋 salut ${auteurMessage.split("@")[0]} 👋
Je suis *${nom}*, un bot développé par *La team Zokou*.

*Voici la liste de mes commandes :*
◇                             ◇
`;

    for (const cat in coms) {
        menuMsg += `*╔══✵* *${cat}*  *✵ ══╗*`;
        for (const cmd of coms[cat]) {
            menuMsg += `
*✗✪* ${cmd}`;
        }
        menuMsg += `
*╚════ ✵ ✵ ═══╝* \n`
    }

    menuMsg += `
◇            ◇
*»»————— ★ —————««*
Pour utiliser une  commande, tapez  ${prefixe}"nom de la commande"
 
 *『ZokouMD*
                                                
*»»————— ★ —————««*
`;

   var lien = mybotpic();

  /* if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Zokou-MD*, développé par Djalega++" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *Zokou-MD*, développé par Djalega++" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
} */  
zk.sendMessage(dest, { 
text: infoMsg + menuMsg,
mentions:[auteurMessage],
contextInfo:{
mentionedJid:[auteurMessage],
"externalAdReply": {
"showAdAttribution": true,
"renderLargerThumbnail": true,
"title": ${nom}, 
"containsAutoReply": true,
"mediaType": 1, 
"thumbnail": lien,
"mediaUrl": `https://chat.whatsapp.com/H6oeuhfSMtV1Orjmf2NVnl`,
"sourceUrl": `https://chat.whatsapp.com/H6oeuhfSMtV1Orjmf2NVnl`
}
}
})
    }
});
