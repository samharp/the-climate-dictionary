document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("sections");

  try {
    const response = await fetch("./data/dictionary.json", {
      cache: "reload", // force revalidate with server
      headers: {
        "Cache-Control": "no-cache", // ensure server checks freshness
        "Pragma": "no-cache"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Clear container if reloading
    container.innerHTML = "";

    data.sections.forEach(section => {
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("section");
      sectionDiv.id = section.title.toLowerCase(); // ID = letter

      const sectionTitle = document.createElement("p");
      sectionTitle.classList.add('h2');
      sectionTitle.textContent = section.title;
      sectionDiv.appendChild(sectionTitle);

      section.parts.forEach(part => {
        const partDiv = document.createElement("div");
        partDiv.classList.add("part");
        if(part.id){
          partDiv.setAttribute("id", part.id);
        }

        // Part columns

        // Column one
        const partColumnOne = document.createElement("div");
        partColumnOne.classList.add('part-content');
        partDiv.appendChild(partColumnOne);

        // Part title wrap
        const partTitleWrap = document.createElement("div");
        partColumnOne.appendChild(partTitleWrap);

        // Part title (H3)
        const partTitle = document.createElement("h3");
        partTitle.classList.add('h2');
        partTitle.textContent = part.title;
        partTitleWrap.appendChild(partTitle);

        // Part phonetic (optional)
        if (part.phonetic) {
          const phoneticEl = document.createElement("p");
          phoneticEl.classList.add("part-info");
          phoneticEl.textContent = part.phonetic;
          partTitleWrap.appendChild(phoneticEl);
        }

        part.content.forEach(paragraph => {
          const p = document.createElement("p");
          p.textContent = paragraph;
          partColumnOne.appendChild(p);
        });


        // Column two
        const partColumnTwo = document.createElement("div");
        partColumnTwo.classList.add('part-aside');
        partDiv.appendChild(partColumnTwo);

        // Share link
        const partActionTitle = document.createElement("p");
        partActionTitle.classList.add("h4");
        partActionTitle.textContent = "Share this definition:";
        partColumnTwo.appendChild(partActionTitle);

        const partActionLink = document.createElement("button");
        partActionLink.setAttribute("data-url", "https://theclimatedictionary.com/" + "#" + part.id);
        partActionLink.setAttribute("title", "Share this definition");
        partActionLink.innerHTML = `<span>Copy link</span> <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 128 128" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M57 64a20 20 90 0 0 29 6l18-20a20 20 90 0 0-31-26L55 44" id="l"/><use href="#l"/><use href="#l" transform="rotate(180 64 64)"/></svg>`;
        partActionLink.classList.add("copy-url");
        partColumnTwo.appendChild(partActionLink);

        if(part.sourceLink){
          // Definition source
          const partSourceTitle = document.createElement("p");
          partSourceTitle.classList.add("h4");
          partSourceTitle.textContent = "Original source:";
          partColumnTwo.appendChild(partSourceTitle);

          const partSource = document.createElement("a");
          partSource.setAttribute("href", part.sourceLink);
          partSource.setAttribute("target", "_blank");
          partSource.setAttribute("rel", "noopener noreferrer");
          partSource.innerHTML = `${part.source}<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 128 128" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" fill="none" stroke-width="5"><path d="m103 80V25H48m55 0-79 79"/></svg>`;
          partSource.classList.add("has-icon");
          partColumnTwo.appendChild(partSource);
        }


        // Add part to section
        sectionDiv.appendChild(partDiv);
      });

      container.appendChild(sectionDiv);
    });

  } catch (err) {
    console.error("Error loading JSON:", err);
  }

  const copyBtns = document.querySelectorAll('.copy-url');
  if(copyBtns){
    copyBtns.forEach(copyBtn => {
      copyBtn.addEventListener('click', function () {
        const url = copyBtn.getAttribute('data-url');
        if (!url) {
          console.warn('No data-url attribute found.');
          return;
        }
        // use the navigator API to write to the clipboard
        navigator.clipboard.writeText(url)
          .then(() => {
            copyBtn.classList.add('copied');
            copyBtn.querySelector('span').textContent = "Copied";
            setTimeout(function(){
              copyBtn.classList.remove('copied');
              copyBtn.querySelector('span').textContent = "Copy link";
            }, 2000);
            console.log('URL copied to clipboard:', url);
          })
          .catch(err => {
            console.error('Failed to copy URL:', err);
          });
      });
    });
  }
});



// light and dark mode toggle

// first set up our constants for the containers
// get the main theme container. this could also be your html or body element
const themeContainer = document.getElementById('theme-container');

// get any stored theme in local storage
const storedTheme = localStorage.getItem('theme');
// check if stored theme exists
if (localStorage.getItem('theme')) {
  // set the default theme to the stored theme
  themeContainer.setAttribute('data-theme', storedTheme);
} else if (window.matchMedia('(prefers-color-scheme)').matches) { // check if browser supports prefered color scheme
  // check the default preference on load
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // set the default theme to the prefered theme
    themeContainer.setAttribute('data-theme', 'dark');
  } else if (window.matchMedia("(prefers-color-scheme: light)")) {
    // set the default theme to the prefered theme
    themeContainer.setAttribute('data-theme', 'light');
  }
  // if user changes their prefered scheme to dark
  window.matchMedia("(prefers-color-scheme: dark)").addListener(
    e => {
      if(e.matches) {
        // set the default theme to the prefered theme
        themeContainer.setAttribute('data-theme', 'dark');
      }
    }
  );
  // if user changes their prefered scheme to light
  window.matchMedia("(prefers-color-scheme: light)").addListener(
    e => {
      if(e.matches) {
        // set the default theme to the prefered theme
        themeContainer.setAttribute('data-theme', 'light');
      }
    }
  );
}

// create the theme toggle function
function toggleTheme(){
  // get our changing theme data attribute
  let currentTheme = themeContainer.getAttribute('data-theme');

  // if the theme is light, change to dark and vis versa
  if(currentTheme === 'light'){
    // change the data attribute to dark
    themeContainer.setAttribute('data-theme', 'dark');
    // change the title text to the current theme
    localStorage.setItem('theme', 'dark');
  } else {
    // change the data attribute to light
    themeContainer.setAttribute('data-theme', 'light');
    // change the title text to the current theme
    localStorage.setItem('theme', 'light');
  }
}