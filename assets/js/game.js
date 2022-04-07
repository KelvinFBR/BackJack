import * as underscore from "./underscore-min.js";

//! El copiar todos los nombres de los elementos que usaremos(fotos) no es buena practica.

let deck = [];
const typesCards = ["C", "D", "H", "S"];
const letterCards = ["A", "J", "K", "Q"];
const sign = {
  win: "win",
  tied: "tied",
  loser: "loser",
};

//* elementos HTML
const signImg = document.querySelector("#sign img");
const titleSign = document.querySelector("#sign p");
const signContainer = document.getElementById("sign");
const cardsContainerPlayer = document.getElementById("cards-container-player");
const cardsContainerComputer = document.getElementById(
  "cards-container-computer"
);
const valueCard = document.querySelectorAll(".value-card");
const buttonGetDisabled = document.getElementById("get");
const buttonStopDisabled = document.getElementById("stop");
let left = 0;
let pointPlayer = 0,
  pointComputer = 0;

//* creacion de la funcion  que nos creara el Desk

//todo: funcion con forEach y un for
const createDesk = () => {
  for (let i = 2; i <= 10; i++) {
    typesCards.forEach((item) => {
      deck.push(`${i}${item}`);
    });
  }

  letterCards.forEach((item1) => {
    typesCards.forEach((item2) => {
      deck.push(`${item1}${item2}`);
    });
  });

  deck = _.shuffle(deck);

  return deck;
};

//todo: Optener un elemento aleatorio del array de scartas
const getRandomCard = () => {
  const max = deck.length;
  const indexRandom = Math.floor(Math.random() * max);

  //* validacion si el array ya no contiene elementos.
  if (deck.length === 0) {
    throw "No hay mas cartas";
  }

  //* eliminado la carta seleccionada del array esta es una forma
  const card = deck[indexRandom];
  deck = deck.filter((item) => item !== card);

  return card;
};

const getValueCard = (card) => {
  let valuecard = card.substring(0, card.length - 1);

  //* En esta forma solo lo multiplicamos por 1 y comvertimo el valor de string a numero. por que aunque sea un numero en string lo interpreta como numero por eso se coloca 1 por que dara el mismo valor.
  return isNaN(valuecard)
    ? valuecard === "A"
      ? (valuecard = 11)
      : (valuecard = 10)
    : valuecard * 1;
};

//* alertas jugo
const signPlay = (typeSign, title) => {
  signImg.src = `./assets/icon/${sign[typeSign]}.svg`;
  signContainer.classList.remove("opacity-0", "-translate-y-96");
  signContainer.classList.add("opacity-100", "-translate-y-0");
  titleSign.textContent = title;

  setTimeout(() => {
    signContainer.classList.add("opacity-0", "-translate-y-96");
    signContainer.classList.remove("opacity-100", "-translate-y-0");
  }, 1500);
};

const winner = () => {
  if (pointPlayer - pointComputer > 0) {
    if (pointPlayer <= 21) {
      signPlay("win", "Player 1 Win");
    } else {
      signPlay("loser", "Computer Win");
    }
  } else if (pointPlayer - pointComputer === 0) {
    signPlay("tied", "Tied Game");
  } else {
    if (pointComputer <= 21) {
      signPlay("loser", "Computer Win");
    } else {
      signPlay("win", "Player 1 Win");
    }
  }
};

//* Creacion de la carta con su su valor
const createCard = (container, point, indexCard) => {
  const card = getRandomCard();
  const imgCard = document.createElement("img");

  imgCard.src = `./assets/cartas/${card}.png`;
  imgCard.alt = "card";
  imgCard.style.left = `${left}px`;
  imgCard.classList.add("absolute", "top-0", "h-full");
  container.appendChild(imgCard);
  left += 24;

  //* valor de la cartas
  point += getValueCard(card);
  valueCard[indexCard].textContent = point;
  return point;
};

//* turno computadora
const Computer = (pointPlayer) => {
  //* reinicio del left
  left = 0;
  do {
    //* creacion de las cartas de la computadora
    pointComputer = createCard(cardsContainerComputer, pointComputer, 1);

    if (pointPlayer > 21) {
      break;
    }
  } while (pointComputer < pointPlayer && pointPlayer <= 21);
  winner();
};

//* Inicializacion de funcion Creacion de las barajas
createDesk();

document.addEventListener("click", (e) => {
  if (e.target.matches("button#get")) {
    //* creacion de las cartas del jugador
    pointPlayer = createCard(cardsContainerPlayer, pointPlayer, 0);

    //* validacion de si gano o perdio el jugador
    if (pointPlayer > 21) {
      //*  desactivar boton get
      buttonGetDisabled.disabled = true;
      buttonStopDisabled.disabled = true;

      //* turno de la computadora
      Computer(pointPlayer);
    } else if (pointPlayer === 21) {
      //*  activacion boton get
      buttonGetDisabled.disabled = true;
      buttonStopDisabled.disabled = true;

      //*  turno de la computadora
      Computer(pointPlayer);
    }

    //* nuevo juego
  }
  if (e.target.matches("button#new")) {
    //*  creacion de cartas nuevas y barajadas
    deck = [];
    deck = createDesk();

    //* reicinio de variables
    left = 0;
    pointPlayer = 0;
    pointComputer = 0;
    valueCard[0].textContent = 0;
    valueCard[1].textContent = 0;
    cardsContainerPlayer.textContent = "";
    cardsContainerComputer.textContent = "";

    //*  activar boton get y stop
    buttonGetDisabled.disabled = false;
    buttonStopDisabled.disabled = false;
  }

  if (e.target.matches("button#stop")) {
    //* turno de la computadora
    Computer(pointPlayer);

    //* desactivar boton get y stop
    buttonGetDisabled.disabled = true;
    buttonStopDisabled.disabled = true;
  }
});

// ! se podria colocar una funcion que sea para el reset ya que si la aplicamos para cuando gane se ejecute automaticamente y una alerta de que gano.
