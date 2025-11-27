// dossier.js – DECEMBER MODE with persistence + hover key + missions + dialog + mission success labels

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "kissmasOpenedDays_december";

  const missions = {
    1: {
      title: "01: Dino Directive",
      text: "I roar when I’m happy, I crunch when I feast, my favorite snack is both salty and sweet.",
      answer: "Popcorn",
    },
    2: {
      title: "02: The Sailor's Code",
      text: ".. / .-.. --- ...- . / -.-- --- ..-",
      answer: "I love you",
    },
    3: {
      title: "03: The Carey Protocol",
      text: "Decode the phrase: uoy si samtsirhC rof tnaw I llA",
      answer: "All I want for Christmas is you",
    },
    4: {
      title: "04: Operation Bathtub Occupied",
      text: "Before Christmas dinner, families often keep me alive in their bathtub. What am I?",
      answer: "Carp",
    },
    5: {
      title: "05: Slavic Sweet-Talk",
      text: "Name 3 Czech words related to love.",
      answer: "",
    },
    6: {
      title: "06: Arctic Footprint Analysis",
      text: "I’m big and white and walk on snow, across the ice I softly go. I hunt for seals, I’m hard to scare. Who am I?",
      answer: "Polar bear",
    },
    7: {
      title: "07: Operation LOL",
      text: "Find or create a meme that best describes Commander Lovebird.",
      answer: "",
    },
    8: {
      title: "08: The Swift Cipher",
      text: "Encrypted intel: 🕰️✨🌙💜🎶 (Hint: 2AM, who do you love?)",
      answer: "Enchanted",
    },
    9: {
      title: "09: Mission Under the Wraps",
      text: "One gift weighs 1.5 kg. Another gift weighs 2.3 kg. Together, how much do they weigh?",
      answer: "3.8 kg",
    },
    10: {
      title: "10: Classified Caption",
      text: "Take a random photo now. Give it a fitting newspaper title.",
      answer: "",
    },
    11: {
      title: "11: Nightfall Intercept",
      text: "The Czech carol Tichá noc has a German version. What is it called in German?",
      answer: "Stille Nacht",
    },
    12: {
      title: "12: The Carol Crime",
      text: "Find one Christmas lyric that sounds inappropriate out of context.",
      answer: "",
    },
    13: {
      title: "13: Color Intelligence",
      text: "Find three things that match Commander Lovebird’s favorite colour.",
      answer: "",
    },
    14: {
      title: "14: Operation Dancing Lights",
      text: "PQTVJGTP NKIHVU (Hint: The alphabet wraps around. After Z, you go back to A.)",
      answer: "Northern lights",
    },
    15: {
      title: "15: Operation Roll Call",
      text: "Roll a dice. Odd - you owe pleasure to Commander Lovebird 😈, Even - Commander Lovebird owes you pleasure 😮‍💨",
      answer: "",
    },
    16: {
      title: "16: Eternal Evidence",
      text: "Choose your favorite photo of you and Commander Lovebird.",
      answer: "",
    },
    17: {
      title: "17: Project Crystal Drop",
      text: "I fall but never break, I melt but never ache.",
      answer: "Snowflake",
    },
    18: {
      title: "18: The Letter Box",
      text: "Rearrange the letters to reveal the secret phrase: S S E K M S I A",
      answer: "Kissmas",
    },
    19: {
      title: "19: The Echoes of October",
      text: "25.10.2023 - loud guitars, four guys. Sugar, we went down.",
      answer: "Fall Out Boy",
    },
    20: {
      title: "20: Project Double Agent",
      text: "To verify your allegiance, take a selfie in spy disguise. Sunglasses, serious faces or household props required.",
      answer: "",
    },
    21: {
      title: "21: The Melt Test",
      text: "Send one photo that you believe will melt Commander Lovebird's heart.",
      answer: "",
    },
    22: {
      title: "22: Chance Encounter",
      text: "Ask Siri to choose number between 1 and 5. The number decides where the kiss happens: 1 - Lips, 2 - Cheek, 3 - 🍆, 4 - Forehead, 5 - 🍒",
      answer: "",
    },
    23: {
      title: "23: The Reindeer Capital",
      text: "Which country is often called “the land of a thousand reindeer” and has more reindeer than people in some regions?",
      answer: "Finland",
    },
    24: {
      title: "24: The Debriefing",
      text: "You’ve completed every challenge, cracked every code and solved every puzzle through 23 days of chaos. Let's close this mission together…",
      answer: "",
    },
  };

  const unavailableDays = new Set([]);

  // --- helpers: load/save state ---
  function loadOpenedDays() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error loading opened days:", e);
      return [];
    }
  }

  function saveOpenedDays(days) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
    } catch (e) {
      console.error("Error saving opened days:", e);
    }
  }

  const openedDays = new Set(loadOpenedDays());

  // 🔹 REAL date – but now also check month
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth(); // 0 = Jan, 11 = Dec
  const isDecember = currentMonth === 11;

  // --- DOM ---
  const cells = document.querySelectorAll(".dossier-cell");
  const dialog = document.querySelector(".window");
  const closeButton = document.querySelector(".dialog-close");

  cells.forEach((cell) => {
    const numberEl = cell.querySelector(".cell-number");
    if (numberEl) {
      numberEl.textContent = cell.dataset.day;
    }
  });

  function openDialogForDay(day) {
    if (!dialog) return;

    const dialogTitle = dialog.querySelector(".dialog-title");
    const dialogBody = dialog.querySelector(".dialog-body");
    const mission = missions[day];

    if (dialogTitle) {
      if (mission && mission.title) {
        dialogTitle.textContent = mission.title;
      } else {
        dialogTitle.textContent = `Day ${day} — Mission Briefing`;
      }
    }

    if (dialogBody) {
      if (mission) {
        const textHtml = mission.text ? `<p>${mission.text}</p>` : "";

        const hasAnswer =
          typeof mission.answer === "string" &&
          mission.answer.trim().length > 0;

        const isFinalDay = day === 24;

        // --- DAY 24: only final text + link ---
        if (isFinalDay) {
          dialogBody.innerHTML =
            textHtml +
            `
            <div class="gold-hr"></div>
            <p style="margin-top: 1rem; text-align:center;">
              For your final Kissmas transmission, Commander Lovebird prepared something special for you. 💛<br>
              <a href="https://www.youtube.com/watch?v=G-bErbL5MVc&list=RDG-bErbL5MVc&start_radio=1"
                 target="_blank"
                 class="final-link"
                 style="
                   font-weight: 700;
                   display: inline-block;
                   margin-top: 0.8rem;
                   text-decoration: none;
                 ">
                Let's celebrate!
              </a>
            </p>
          `;
          dialog.showModal();
          return;
        }

        let answerBlockHtml = "";

        if (hasAnswer) {
          // missions WITH answer → input + check
          answerBlockHtml = `
            <div class="gold-hr"></div>
            <div class="mission-answer-block">
              <label class="mission-answer-label">
                Your answer:
                <input type="text" class="mission-answer-input" autocomplete="off" />
              </label>
              <button type="button" class="mission-answer-submit">Check</button>
              <p class="mission-answer-feedback" aria-live="polite"></p>
            </div>
          `;
        } else {
          // missions WITHOUT answer (non-24) → just message
          answerBlockHtml = `
            <div class="gold-hr"></div>
            <div class="mission-answer-block">
              <p class="mission-answer-feedback" style="text-align:center;">
                Commander Lovebird looks forward to hearing from you.
              </p>
            </div>
          `;
        }

        dialogBody.innerHTML = textHtml + answerBlockHtml;

        if (!hasAnswer) {
          dialog.showModal();
          return;
        }

        const answerInput = dialogBody.querySelector(".mission-answer-input");
        const submitBtn = dialogBody.querySelector(".mission-answer-submit");
        const feedback = dialogBody.querySelector(".mission-answer-feedback");

        const normalizedAnswers = Array.isArray(mission.answer)
          ? mission.answer.map((a) => String(a).toLowerCase().trim())
          : [String(mission.answer).toLowerCase().trim()];

        function checkAnswer() {
          const userAnswer = answerInput.value.toLowerCase().trim();
          const isCorrect = normalizedAnswers.includes(userAnswer);

          feedback.classList.remove("correct", "incorrect");

          if (isCorrect) {
            feedback.textContent =
              "Mission accomplished. Send proof of your success to Commander Lovebird in order to collect your reward.";
            feedback.classList.add("correct");
          } else {
            feedback.textContent = "Not quite. Try again, Agent.";
            feedback.classList.add("incorrect");
          }
        }

        submitBtn.addEventListener("click", checkAnswer);
        answerInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            checkAnswer();
          }
        });
      } else {
        dialogBody.textContent = "No mission assigned for this day yet.";
      }
    }

    dialog.showModal();
  }

  if (closeButton && dialog) {
    closeButton.addEventListener("click", () => {
      dialog.close();
    });
  }

  // --- main setup for each cell ---
  cells.forEach((cell) => {
    const day = parseInt(cell.dataset.day, 10);
    const number = cell.querySelector(".cell-number");
    const icon = cell.querySelector(".cell-icon");
    const label = cell.querySelector(".cell-label");

    cell.classList.remove(
      "locked",
      "available",
      "opened",
      "denied",
      "unlock-anim",
      "hover-key"
    );

    if (!icon || !number) return;

    const isOpened = openedDays.has(day);
    const isUnavailable = unavailableDays.has(day);

    // If it's NOT December yet → everything is future/locked
    const isFuture = !isDecember || day > currentDay;

    if (isUnavailable) {
      cell.classList.add("locked");
      number.style.opacity = 1;
      icon.style.opacity = 1;
      icon.textContent = "🔒";
      if (label) label.textContent = "Unavailable";
      cell.style.cursor = "default";
    } else if (isOpened) {
      // Already opened in a previous visit
      cell.classList.add("opened");
      number.style.display = "";
      number.style.opacity = 1;
      icon.style.opacity = 1;
      icon.textContent = "🔓";
      cell.style.cursor = "pointer";

      if (isDecember && day < currentDay) {
        if (label) label.textContent = "Mission Success";
      } else {
        if (label) label.textContent = "Opened";
      }
    } else if (isFuture) {
      // Future days OR any day before December
      cell.classList.add("locked");
      number.style.opacity = 1;
      icon.style.opacity = 1;
      icon.textContent = "🔒";
      if (label) label.textContent = isDecember ? "Classified" : "Locked";
      cell.style.cursor = "default";
    } else {
      // It is December, and day <= currentDay, and not opened yet → available
      cell.classList.add("available");
      number.style.opacity = 1;
      icon.style.opacity = 1;
      icon.textContent = "🔒";
      if (label) label.textContent = "Unlock";
      cell.style.cursor = "pointer";

      cell.addEventListener("mouseenter", () => {
        if (cell.classList.contains("opened")) return;
        cell.classList.add("hover-key");
        icon.textContent = "🗝️";
      });

      cell.addEventListener("mouseleave", () => {
        if (cell.classList.contains("opened")) return;
        cell.classList.remove("hover-key");
        icon.textContent = "🔒";
      });
    }

    // CLICK – shared
    cell.addEventListener("click", () => {
      const currentCellDay = parseInt(cell.dataset.day, 10);

      if (unavailableDays.has(currentCellDay)) {
        cell.classList.remove("denied");
        void cell.offsetWidth;
        cell.classList.add("denied");
        return;
      }

      // if not December or in the future → shake only
      if (!isDecember || currentCellDay > currentDay) {
        cell.classList.remove("denied");
        void cell.offsetWidth;
        cell.classList.add("denied");
        return;
      }

      if (cell.classList.contains("opened")) {
        openDialogForDay(currentCellDay);
        return;
      }

      // unlock animation + open
      cell.classList.remove("hover-key");
      cell.classList.add("unlock-anim");

      setTimeout(() => {
        cell.classList.remove("unlock-anim");
        cell.classList.add("opened");

        number.style.display = "";
        number.style.opacity = 1;

        icon.style.opacity = 1;
        icon.textContent = "🔓";

        if (isDecember && currentCellDay < currentDay) {
          if (label) label.textContent = "Mission Success";
        } else {
          if (label) label.textContent = "Opened";
        }

        openedDays.add(currentCellDay);
        saveOpenedDays([...openedDays]);

        openDialogForDay(currentCellDay);
      }, 450);
    });
  });
});
