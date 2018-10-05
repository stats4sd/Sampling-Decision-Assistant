import { saveAs } from "file-saver";
import * as htmlDocx from "html-docx-js/dist/html-docx";

export function _download(data, filename) {
  saveAs(data, filename);
}

export function _htmlToDoc(elementId: string, filename: string) {
  console.log("exporting docx", htmlDocx);
  const html = document.getElementById(elementId).outerHTML;
  const content = "<!DOCTYPE html>" + html;
  const converted = htmlDocx.asBlob(content);
  saveAs(converted, `${filename}.docx`);
}
