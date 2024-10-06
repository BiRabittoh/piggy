document.addEventListener('DOMContentLoaded', function () {
    handleID();

    document.getElementById('save').addEventListener('click', submit);
    
    if (id === 0) {
        document.getElementById('delete').style.display = "none";
    } else {
        document.getElementById('delete').addEventListener('click', remove);
    }
});

let id;

async function handleID() {
    id = getQueryStringID();
    const record = id === 0 ? null : await getAccount(id);
    document.getElementById("main-container").appendChild(loadAccount(record));
}

function loadAccount(account) {
    const div = document.createElement("div");
    div.setAttribute("data-type", "account");
    div.setAttribute("data-id", id);
    div.classList.add("account");

    // account.name
    div.appendChild(newInputText("Name", account?.name, "account-name"));

    return div;
}

function getInputValueFromNode(node, name) {
    const element = node.getElementsByClassName(name)[0];
    return element.type === "checkbox" ? element.checked : element.value;
}

function buildAccountObject() {
    const node = document.getElementsByClassName("account")[0];
    return {
        id: +node.getAttribute("data-id"),
        name: getInputValueFromNode(node, "account-name"),
    }
}

async function submit() {
    if (await saveAccount(buildAccountObject())) {
        location.href = "/accounts"
    }
}

async function remove() {
    if (await myConfirm(deleteAccount, id)) {
        location.href = "/accounts"
    }
}

