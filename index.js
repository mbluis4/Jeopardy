let getJeo = async (categories, offset) => {
  const res = await fetch(
    `https://jservice.io/api/categories?count=${categories}&offset=${offset}`
  );
  const data = await res.json();
  return data;
};

const board = document.getElementById("board");

let getCategories = (data) => {
  let dispData = `
    <div class='categories ${data.title}'>${data.title}</div>
    ${getClueHtml(200, data.id)}
    ${getClueHtml(400, data.id)}
    ${getClueHtml(600, data.id)}
    ${getClueHtml(800, data.id)}
    `;
  return dispData;
};

getJeo(5, 20).then((data) => {
  board.innerHTML = data.map(getCategories).join("");
  let allCat = Array.from(document.getElementsByClassName("categories-clue"));
  allCat.forEach((element) => {
    let renderClue = () => {
      getClues(
        parseInt(element.id),
        parseInt(element.textContent.slice(2))
      ).then((clue) => {
        element.textContent = clue[0].question;
        element.classList.add("question");
        let inputAnswer = document.createElement("input");
        element.appendChild(inputAnswer);
        element.removeEventListener("click", renderClue);
        //validate answer
        element.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            if (
              inputAnswer.value.toLowerCase() === clue[0].answer.toLowerCase()
            ) {
              element.innerHTML = "Correct!";
              element.classList.remove("question");
              element.classList.add("right-answer");
            } else {
              inputAnswer.value = "Wrong answer!";
            }
          }
        });
      });
    };
    element.addEventListener("click", renderClue);
  });
});

let getClueHtml = (clueValue, id) => {
  return `
    <div class='categories-clue' id='${id}' style='grid-row-start:${
    clueValue / 200 + 1
  }'>$ ${clueValue}</div>
    `;
};
let getClues = async (category, clueValue) => {
  const res = await fetch(
    `https://jservice.io/api/clues?category=${category}&value=${clueValue}`
  );
  const data = await res.json();
  console.log(data);
  return data;
};
