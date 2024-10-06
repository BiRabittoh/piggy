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
    const record = id === 0 ? null : await getRecord(id);
    document.getElementById("main-container").appendChild(loadRecord(record));
}

function loadRecord(record) {
    const div = document.createElement("div");
    div.setAttribute("data-type", "record");
    div.setAttribute("data-id", id);
    div.classList.add("record");

    // record.type
    div.appendChild(newInputText("Type", record?.type, "record-type"));

    // record.description
    div.appendChild(newInputText("Description", record?.description, "record-description"));

    // record.done
    div.appendChild(newInputCheckbox("Done", record?.done, "record-done"));

    // record.entries
    div.appendChild(loadEntries(record?.entries ?? [null, null], "record-entries"));

    return div;
}

function loadEntries(entries, name) {
    const div = document.createElement("div")
    div.className = name;

    const newEntry = document.createElement("button");
    newEntry.innerText = "Add entry";
    newEntry.onclick = () => div.appendChild(loadEntry(null));
    div.appendChild(newEntry);

    for (const entry of entries) {
        div.appendChild(loadEntry(entry));
    }
    return div;
}

function loadEntry(entry) {
    const div = document.createElement("div");
    div.setAttribute("data-type", "entry");
    div.setAttribute("data-id", entry?.id ?? 0);
    div.classList.add("entry");

    const deleteEntry = document.createElement("button");
    deleteEntry.innerText = "Delete entry";
    deleteEntry.onclick = () => div.remove();
    div.appendChild(deleteEntry);

    // entry.bookmaker_id
    div.appendChild(newInputText("Bookmaker ID", entry?.bookmaker_id, "entry-bookmaker_id"))

    // entry.account_id
    div.appendChild(newInputText("Account ID", entry?.account_id, "entry-account_id"))

    // entry.amount
    div.appendChild(newInputText("Amount", entry?.amount, "entry-amount"))

    // entry.refund
    div.appendChild(newInputText("Refund", entry?.refund, "entry-refund"))

    // entry.bonus
    div.appendChild(newInputText("Bonus", entry?.bonus, "entry-bonus"))

    // entry.commission
    div.appendChild(newInputText("Commission", entry?.commission, "entry-commission"))

    // entry.sub_entries
    div.appendChild(loadSubEntries(entry?.sub_entries ?? [null], "entry-subentries"));

    return div;
}

function loadSubEntries(subEntries, name) {
    const div = document.createElement("div")
    div.className = name;

    const newSubEntry = document.createElement("button");
    newSubEntry.innerText = "Add subentry";
    newSubEntry.onclick = () => div.appendChild(loadSubEntry(null));
    div.appendChild(newSubEntry);

    for (const subEntry of subEntries) {
        div.appendChild(loadSubEntry(subEntry));
    }
    return div;
}

function loadSubEntry(subEntry) {
    const div = document.createElement("div");
    div.setAttribute("data-type", "subentry");
    div.setAttribute("data-id", subEntry?.id ?? 0);
    div.classList.add("subentry");

    const deleteSubEntry = document.createElement("button");
    deleteSubEntry.innerText = "Delete subentry";
    deleteSubEntry.onclick = () => div.remove();
    div.appendChild(deleteSubEntry);

    // subentry.description
    div.appendChild(newInputText("Description", subEntry?.description, "subentry-description"));
    
    // subentry.odds
    div.appendChild(newInputText("Odds", subEntry?.odds, "subentry-odds"))
    
    // subentry.won
    div.appendChild(newInputCheckbox("Won", subEntry?.won, "subentry-won"));
    
    // subentry.date
    div.appendChild(newInputText("Date", subEntry?.date, "subentry-date"));

    return div;
}

function getInputValueFromNode(node, name) {
    const element = node.getElementsByClassName(name)[0];
    return element.type === "checkbox" ? element.checked : element.value;
}

function buildRecordObject() {
    const node = document.getElementsByClassName("record")[0];
    return {
        id: +node.getAttribute("data-id"),
        type: getInputValueFromNode(node, "record-type"),
        description: getInputValueFromNode(node, "record-description"),
        done: getInputValueFromNode(node, "record-done"),
        entries: buildEntriesObject(node.getElementsByClassName("record-entries")[0]),
    }
}

function buildEntriesObject(entriesNode) {
    const entriesNodes = entriesNode.getElementsByClassName("entry");
    
    const result = [];
    for (const node of entriesNodes) {
        result.push({
            id: +node.getAttribute("data-id"),
            bookmaker_id: +getInputValueFromNode(node, "entry-bookmaker_id"),
            account_id: +getInputValueFromNode(node, "entry-account_id"),
            amount: +getInputValueFromNode(node, "entry-amount"),
            refund: +getInputValueFromNode(node, "entry-refund"),
            bonus: +getInputValueFromNode(node, "entry-bonus"),
            commission: +getInputValueFromNode(node, "entry-commission"),
            sub_entries: buildSubEntriesObject(node.getElementsByClassName("entry-subentries")[0]),
        });
    }
    return result;
}

function buildSubEntriesObject(subEntriesNode) {
    const subEntriesNodes = subEntriesNode.getElementsByClassName("subentry");
    
    const result = [];
    for (const node of subEntriesNodes) {
        result.push({
            id: +node.getAttribute("data-id"),
            description: getInputValueFromNode(node, "subentry-description"),
            odds: +getInputValueFromNode(node, "subentry-odds"),
            won: getInputValueFromNode(node, "subentry-won"),
            date: getInputValueFromNode(node, "subentry-date"),
        });
    }
    return result;
}

async function submit() {
    if (await saveRecord(buildRecordObject())) {
        location.href = "/records"
    }
}

async function remove() {
    if (await myConfirm(deleteRecord, id)) {
        location.href = "/records"
    }
}
