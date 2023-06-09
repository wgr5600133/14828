// ==UserScript==
// @name         Stable Diffusion image metadata viewer
// @namespace    https://github.com/himuro-majika
// @version      0.2.3
// @description  Show Stable Diffusion generated image's metadata
// @description:ja      Stable Diffusionで生成された画像の埋め込みメタデータを表示します
// @description:ko      표시 Stable Diffusion 생성된 이미지의 메타데이터
// @description:de      Metadaten des durch Stabile Diffusion erzeugten Bildes anzeigen
// @description:es      Mostrar los metadatos de la imagen generada por Stable Diffusion
// @description:fr      Afficher les métadonnées de l'image générée par la Stable Diffusion
// @description:it      Mostrare i metadati dell'immagine generata da Stable Diffusion
// @description:zh-CN   显示 Stable Diffusion 生成的图像的元数据
// @description:zh-SG   显示 Stable Diffusion 生成的图像的元数据
// @description:zh-TW   顯示 Stable Diffusion 生成圖像的元數據
// @description:zh-HK   顯示 Stable Diffusion 生成圖像的元數據
// @author       himuro_majika
// @match        http://*/*.png
// @match        http://*/*.jpg
// @match        http://*/*.jpeg
// @match        http://*/*.webp
// @match        https://*/*.png
// @match        https://*/*.jpg
// @match        https://*/*.jpeg
// @match        https://*/*.webp
// @match        file:///*.png
// @match        file:///*.jpg
// @match        file:///*.jpeg
// @match        file:///*.webp
// @require      https://cdn.jsdelivr.net/npm/exifreader@4.11.0/dist/exif-reader.min.js
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const img = document.images[0];
    if (!img) return;
    readExif(img);

    async function readExif(img) {
        const fileBuffer = await fetch(img.src).then(response => response.arrayBuffer()).catch(() => {return;});
        if (!fileBuffer) return;
        const tags = ExifReader.load(fileBuffer, {expanded: true});
        getComment(tags);
    }

    function getComment(tags) {
        // console.dir(JSON.parse(JSON.stringify(tags)));

        let com = ""

        // Exif
        if (tags.exif && tags.exif.UserComment) {
            com = decodeUnicode(tags.exif.UserComment.value);
            extractPrompt(com);
            return;
        }
        // iTXt
        if (!tags.pngText) return;
        // A1111
        if (tags.pngText.parameters) {
            com = tags.pngText.parameters.description;
            extractPrompt(com);
            return;
        }
        // NMKD
        if (tags.pngText.Dream) {
            com = tags.pngText.Dream.description;
            com += tags.pngText["sd-metadata"] ? "\r\n" + tags.pngText["sd-metadata"].description : "";
            extractPrompt(com);
            return;
        }
        // NAI
        if (tags.pngText.Software && tags.pngText.Software.description == "NovelAI") {
            const positive = tags.pngText.Description.description;
            const negative = tags.pngText.Comment.description.replaceAll(/\\u00a0/g, " ").match(/"uc": "([^]+)"[,}]/)[1];
            let others = tags.pngText.Comment.description.replaceAll(/\\u00a0/g, " ") + "\r\n";
            others += tags.pngText.Software.description + "\r\n";
            others += tags.pngText.Title.description + "\r\n";
            others += tags.pngText.Source.description;
            const prompt = {
                positive: positive,
                negative: negative,
                others: others
            }
            makeButton();
            makeData(prompt);
            return;
        }

        Object.keys(tags.pngText).forEach(tag => {
            com += tags.pngText[tag].description;
        });

        // console.log(com);
        extractPrompt(com);
        return;
    }

    function decodeUnicode(array) {
        const plain = array.map(t => t.toString(16).padStart(2, "0")).join("");
        if (!plain.match(/^554e49434f44450/)) {
            // console.log(array);
            return;
        }
        const hex = plain.replace(/^554e49434f44450[0-9]/, "").replace(/[0-9a-f]{4}/g, ",0x$&").replace(/^,/, "");
        const arhex = hex.split(",");
        let decode = "";
        arhex.forEach(v => {
            decode += String.fromCodePoint(v);
        })
        return decode;
    }

    function extractPrompt(com) {
        const positive = extractPositivePrompt(com);
        const negative = extractNegativePrompt(com);
        const others = extractOthers(com);
        if (!positive && !negative && !others) return;
        const prompt = {
            positive: positive,
            negative: negative,
            others: others
        }
        makeButton();
        makeData(prompt);
    }

    function makeButton() {
        const button = document.createElement("button");
        button.innerHTML = "Show SD metadata";
        button.addEventListener("click", showModal);
        document.body.insertBefore(button, img);
    }

    function makeData(prompt) {
        const positive = prompt.positive;
        const negative = prompt.negative;
        const others = prompt.others;
        const container = document.createElement("div");
        container.id ="_gm_sipv_container";
        container.style.display = "none";
        container.style.width = "100%";
        const copybutton = location.protocol == "http:" ? "" : `<button class="_gm_sipv_copybutton" type="button" style="cursor: pointer; opacity: 0.5;">copy</button>`;
        container.innerHTML = `
<div style="color: #eee; width: 800px; max-width: 100%; margin-left: auto; margin-right: auto; z-index: 2; position: fixed; inset: auto 0; margin: auto; background: #000a; border-radius: 6px; box-shadow: #000 0px 0px 2px;">
    <div style="display:flex; justify-content: space-between; padding: 0px 10px;">
        <h5>Stable Diffusion image metadata</h5>
        <button id="_gm_sipv_closebutton" type="button" style="cursor: pointer; height: 4em; opacity: 0.5; padding: 1em; background: #0000; border: 0; width: 3em;">❎</button>
    </div>
    <div style="padding: 10px;">
        <div>
            <div style="display:flex; justify-content: space-between;">
                <label>Prompt</label>
                ${copybutton}
            </div>
            <textarea rows="6" style="display: block; width: 774px; max-width: 100%; background: #cccc; border: 0px none; margin: 10px 0;">${positive}</textarea>
        </div>
        <div>
            <div style="display:flex; justify-content: space-between;">
                <label>Negative Prompt</label>
                ${copybutton}
            </div>
            <textarea rows="6" style="display: block; width: 774px; max-width: 100%; background: #cccc; border: 0px none; margin: 10px 0;">${negative}</textarea>
        </div>
        <div>
            <div style="display:flex; justify-content: space-between;">
                <label>Other info</label>
                ${copybutton}
            </div>
            <textarea rows="3" style="display: block; width: 774px;  max-width: 100%;background: #cccc; border: 0px none; margin: 10px 0;">${others}</textarea>
        </div>
    </div>
</div>`;
        document.body.insertBefore(container, img);
        document.getElementById("_gm_sipv_closebutton").addEventListener("click", closeModal);
        document.querySelectorAll("._gm_sipv_copybutton").forEach(item => {
            item.addEventListener("click", copyText);
        });
    }

    function extractPositivePrompt(text) {
        try {
            let matchtext = 
            text.match(/([^]+)Negative prompt: /) || 
            text.match(/([^]+)Steps: /) || 
            text.match(/([^]+){"steps"/) || 
            text.match(/([^]+)\[[^[]+\]/);
            return matchtext[1];
        } catch (e) {
            console.log(text);
            return "";
        }
    }

    function extractNegativePrompt(text) {
        try {
            let matchtext = 
            text.match(/Negative prompt: ([^]+)Steps: /) || 
            text.match(/"uc": "([^]+)"}/) || 
            text.match(/\[([^[]+)\]/);
            return matchtext[1];
        } catch (e) {
            console.log(text);
            return "";
        }
    }

    function extractOthers(text) {
        try {
            let matchtext = 
            text.match(/(Steps: [^]+)/) || 
            text.match(/{("steps"[^]+)"uc": /) || 
            text.match(/\]([^]+)/);
            return matchtext[1];
        } catch (e) {
            console.log(text);
            return text;
        }
    }

    function showModal() {
        document.getElementById("_gm_sipv_container").style.display = "block";
    }

    function closeModal() {
        document.getElementById("_gm_sipv_container").style.display = "none";
    }

    function copyText() {
        const value = this.parentNode.parentNode.querySelector("textarea").value;
        navigator.clipboard.writeText(value);
    }

})();