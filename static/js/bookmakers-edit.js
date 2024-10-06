document.addEventListener('DOMContentLoaded', function () {
    handleID();

    document.getElementById('save').addEventListener('click', submit);
});

let id;

async function handleID() {
    id = getQueryStringID();
    const record = id === 0 ? null : await getBookmaker(id);
    document.getElementById("main-container").appendChild(loadBookmaker(record));
}

function loadBookmaker(bookmaker) {
    const div = document.createElement("div");
    div.setAttribute("data-type", "bookmaker");
    div.setAttribute("data-id", id);
    div.classList.add("bookmaker");

    // bookmaker.name
    div.appendChild(newInputText("Name", bookmaker?.name, "bookmaker-name"));

    // bookmaker.default_commission
    div.appendChild(newInputText("Commission", bookmaker?.default_commission, "bookmaker-default_commission"));

    return div;
}

function getInputValueFromNode(node, name) {
    const element = node.getElementsByClassName(name)[0];
    return element.type === "checkbox" ? element.checked : element.value;
}

function buildBookmakerObject() {
    const node = document.getElementsByClassName("bookmaker")[0];
    return {
        id: +node.getAttribute("data-id"),
        name: getInputValueFromNode(node, "bookmaker-name"),
        default_commission: +getInputValueFromNode(node, "bookmaker-default_commission"),
    }
}

async function submit() {
    if (await saveBookmaker(buildBookmakerObject())) {
        location.href = "/bookmakers"
    }
}

