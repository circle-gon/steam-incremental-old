// if domain don't end with "/" stuff becomes wrong
// glitch doesn't do it by default though

if (!window.location.href.endsWith("/")) {
  window.location.href += "/";
  // link if webpage doesn't redirect
  const url = document.createElement("a");
  url.innerHTML = "Click here if the webpage does not redirect you.";
  url.href = window.location.href + "/";

  // helper text
  const text = document.createElement("div");
  text.innerHTML = "Oops, looks like the url entered wasn't correct! ";
  text.appendChild(url);
  document.body.appendChild(text);
}
