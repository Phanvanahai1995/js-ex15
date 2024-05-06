const list = document.querySelector(".list");
const listItems = document.querySelectorAll(".list-item");
const moduleItems = document.querySelectorAll(".active");

let indexItem = 0;
let indexModule = 0;

function render(rootEl) {
  const childArr = Array.from(rootEl.children);

  childArr.forEach(function (item) {
    item.draggable = "true";

    let title = "Bài ";

    if (item.classList.contains("active")) {
      title = "Module ";
      indexModule++;
    } else {
      indexItem++;
    }

    if (!item.children.length) {
      item.innerHTML = `${title} ${
        title === "Module " ? indexModule : indexItem
      }: <span>${item.innerText}</span>`;
    } else {
      item.innerHTML = `${title} ${
        title === "Module " ? indexModule : indexItem
      }: <span>${item.children[0].innerText}</span>`;
    }
  });
}

const getOffset = function (e) {
  const clientRect = e.target.getBoundingClientRect();
  const offset = {
    x: e.pageX - clientRect.left,
    y: e.pageY - clientRect.top,
  };
  return offset;
};

const getHeight = function (element) {
  const clientRect = element.getBoundingClientRect();
  return (clientRect.bottom - clientRect.top) / 2;
};

function sortable(rootEl, onUpdate) {
  let dragElement;

  render(rootEl);

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    var targetElement = e.target;
    if (
      targetElement &&
      targetElement !== dragElement &&
      targetElement.nodeName === "DIV"
    ) {
      const offset = getOffset(e);
      const halfHeight = getHeight(e.target);

      if (offset.y > halfHeight) {
        if (targetElement.nextSibling.parentElement === rootEl) {
          rootEl.insertBefore(dragElement, targetElement.nextSibling);
        }
      } else {
        if (targetElement.parentElement === rootEl) {
          rootEl.insertBefore(dragElement, targetElement);
        }
      }
    }
  }

  function handleDragEnd(e) {
    e.preventDefault();

    dragElement.classList.remove("hide");
    rootEl.removeEventListener("dragover", handleDragOver);
    rootEl.removeEventListener("dragend", handleDragEnd);

    onUpdate(dragElement);
  }

  rootEl.addEventListener("dragstart", function (e) {
    dragElement = e.target;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("Text", dragElement.textContent);

    rootEl.addEventListener("dragover", handleDragOver);
    rootEl.addEventListener("dragend", handleDragEnd);

    setTimeout(function () {
      dragElement.classList.add("hide");
    }, 0);

    const viewportHeight = window.innerHeight;
  });
}

sortable(list, () => {
  indexItem = 0;
  indexModule = 0;

  render(list);
});
