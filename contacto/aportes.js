const copyButton = document.querySelector("#copy-alias");
const alias = document.querySelector("#alias");
const status = document.querySelector("#copy-status");

copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(alias.textContent.trim());
    status.textContent = "Alias copiado.";
  } catch {
    status.textContent = "Podés seleccionar y copiar el alias manualmente.";
  }
});
