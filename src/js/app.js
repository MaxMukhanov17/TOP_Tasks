import Board from "./Board";
import CardController from "./CardController";

const container = document.getElementById("container");
const board = new Board(container);

const controller = new CardController(board);
controller.init();
