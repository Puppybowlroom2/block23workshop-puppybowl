const playerContainer = document.querySelector("#all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-acc-pt-web-pt-b";

// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const players = await response.json();

    return players;
  } catch (e) {
    console.log("Uh oh, trouble fetching players!", e);
  }
};

const fetchSinglePlayerByID = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const player = await response.json();

    return player.data.player;
  } catch (err) {
    console.log(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (player) => {
  const response = await fetch(`${APIURL}/players`, {
    method: "POST",
    body: JSON.stringify(player),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const newPlayer = await response.json();
  return newPlayer;
};

const removePlayer = async (playerId) => {
  try {
    await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });

    const players = await fetchAllPlayers();
    await renderAllPlayers(players);
  } catch (err) {
    console.log(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

const renderSinglePlayer = async (id) => {
  try {
    // const players = playerList.data.players;
    const player = await fetchSinglePlayerByID(id);
    const playerDetailsElement = document.createElement("div");
    playerDetailsElement.classList.add("player-details");
    playerDetailsElement.innerHTML = `
      <h2>${player.name}</h2>
      <p>${player.breed}</p>
      <p>${player.status}</p>
      <p>${player.teamId}</p>
      <img src="${player.imageUrl}" alt="${player.name}">

      <button class="close-btn">Close</button>
    `;
    playerContainer.prepend(playerDetailsElement);

    const closeBtn = playerDetailsElement.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
      playerDetailsElement.remove();
    });
  } catch (e) {
    console.log("Oh, can't close the button!", e);
  }
};

const renderAllPlayers = async (playerList) => {
  try {
    playerContainer.innerHTML = "";
    const players = playerList.data.players;

    players.forEach((player) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player");
      playerElement.innerHTML = `
      <h2>${player.name}</h2>
      <p>${player.breed}</p>
      <p>${player.status}</p>
      <p>${player.teamId}</p>
      <img src="${player.imageUrl}" alt="${player.name}">
      <button class="player-details-btn" data-id="${player.id}">Details</button>
      <button class="player-delete-btn" data-id="${player.id}">Delete</button>
      `;

      playerContainer.appendChild(playerElement);

      //see single player details button
      const detailsBtn = playerElement.querySelector(".player-details-btn");
      detailsBtn.addEventListener("click", async (event) => {
        await renderSinglePlayer(player.id);
      });

      //delete single player button
      const deleteBtn = playerElement.querySelector(".player-delete-btn");
      deleteBtn.addEventListener("click", async (event) => {
        await removePlayer(player.id);
      });
    });
  } catch (err) {
    console.log("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    newPlayerFormContainer.innerHTML = "";
    const newPlayerForm = newPlayerFormContainer;
    newPlayerForm.innerHTML = `
    <h2>Add New Player</h2>
    <form>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" />
  
      <label for="breed">Breed</label>
      <input type="text" name="breed" id="breed" />
  
      <label for="status">Status</label>
      <input type="text" name="status" id="status" />
  
      <button type="submit">Submit</button>
    </form>
  `;

    newPlayerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = document.querySelector("#name").value;
      const breed = document.querySelector("#breed").value;
      const status = document.querySelector("#status").value;

      const newPlayer = {
        name: name,
        breed: breed,
        status: status,
      };
      await addNewPlayer(newPlayer);
      const player = await fetchAllPlayers();
      await renderAllPlayers(player);

    });
  } catch (err) {
    console.log("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  try {
    const players = await fetchAllPlayers();
    console.log(players);

    await renderAllPlayers(players);

    renderNewPlayerForm();

    // const siglePlayer = await fetchSinglePlayerByID();
    // console.log(siglePlayer);
  } catch (e) {
    console.log(e);
  }
};

init();