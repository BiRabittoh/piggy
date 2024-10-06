document.addEventListener('DOMContentLoaded', function () {
    const navObject = document.getElementsByTagName("nav")[0];
    for (const page of navPages) {
        const a = document.createElement("a");
        a.innerText = page.name;
        a.href = page.href;
        navObject.appendChild(a)
    }
});

// Global constants
const navPages = [
    { name: "Home", href: "/" },
    { name: "Bookmakers", href: "/bookmakers" },
    { name: "Accounts", href: "/accounts" },
    { name: "Records", href: "/records" },
];

const currency = "€";
const locale = "it-IT";

// Cell formatters
function formatValue(v) {
    return (v / 100).toFixed(2);
}

function formatCash(v) {
    return formatValue(v) + currency;
}

function formatDate(dateString) {
    return (new Date(dateString)).toLocaleString(locale);
}

function formatBoolean(value, id) {
    const input = document.createElement("input");
    input.type = "checkbox";
    if (value) input.setAttribute("checked", "");
    input.disabled = true;
    //input.setAttribute("data-id", id);
    //input.onchange = undefined;
    return input.outerHTML;
}

// Input components
function newInputText(label, value, name) {
    const l = document.createElement("label");
    const input = document.createElement("input");
    input.className = name;
    input.type = "text";
    input.placeholder = label;
    input.value = value ?? "";
    l.innerHTML += label + "<br />";
    l.appendChild(input);
    return l;
}

function newInputCheckbox(label, value, name) {
    const l = document.createElement("label");
    const input = document.createElement("input");
    input.className = name;
    input.type = "checkbox";
    if (value) input.setAttribute("checked", "");
    l.appendChild(input);
    l.innerHTML += label;
    return l;
}

// Functions
function getQueryStringID() {
    return Number(new URLSearchParams(window.location.search).get("id") ?? 0);
}

async function myConfirm(f, id) {
    if (confirm("Are you sure?")) return await f(id);
    return false;
}

async function handleFetchResult(res) {
    if (!res.ok) {
        console.error(await res.text())
        return
    }

    return await res.json();
}

async function myFetch(url) {
    res = await fetch(url);
    return await handleFetchResult(res);
}

async function myFetchPOST(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    return await handleFetchResult(res);
}

async function myFetchDELETE(url) {
    const res = await fetch(url, { method: 'DELETE' });
    return await handleFetchResult(res);
}

// API calls
async function getBookmakers() {
    return await myFetch('/api/bookmakers');
}

async function getBookmaker(id) {
    return await myFetch(`/api/bookmakers/${id}`);
}

async function saveBookmaker(payload) {
    return await myFetchPOST("/api/bookmakers", payload);
}

async function deleteBookmaker(id) {
    return await myFetchDELETE(`/api/bookmakers/${id}`);
}


async function getAccounts() {
    return await myFetch('/api/accounts');
}

async function getAccount(id) {
    return await myFetch(`/api/accounts/${id}`);
}

async function saveAccount(payload) {
    return await myFetchPOST("/api/accounts", payload);
}

async function deleteAccount(id) {
    return await myFetchDELETE(`/api/accounts/${id}`);
}


async function getRecords() {
    return await myFetch('/api/records');
}

async function getRecord(id) {
    return await myFetch(`/api/records/${id}`);
}

async function saveRecord(payload) {
    return await myFetchPOST("/api/records", payload);
}

async function deleteRecord(id) {
    return await myFetchDELETE(`/api/records/${id}`);
}
