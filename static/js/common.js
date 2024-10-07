document.addEventListener('DOMContentLoaded', function () {
    // navbar
    const navObject = document.getElementsByTagName("nav")[0];
    for (const page of navPages) {
        const a = document.createElement("a");
        a.innerText = page.name;
        a.href = page.href;
        navObject.appendChild(a)
    }
    // favicon
    document.getElementsByTagName("head")[0].innerHTML += favicon;
});

// Global constants
const navPages = [
    { name: "Home", href: "/" },
    { name: "Bookmakers", href: "/bookmakers" },
    { name: "Accounts", href: "/accounts" },
    { name: "Records", href: "/records" },
];
const favicon = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💰</text></svg>">`;

const currency = "€";
const locale = "it-IT";

const flatpickrOptions = {
    enableTime: true,
    time_24hr: true,
    dateFormat: "Z",
};

// Cell formatters
function formatValue(v) {
    if (v === undefined) return 0;
    return (v / 100).toFixed(2);
}

function restoreValue(v) {
    return Number(v) * 100;
}

function formatCash(v) {
    if (v === 0) return "-";
    return `${v > 0 ? "+" : ""}${formatValue(v)}${currency}`;
}

function formatPercentage(v) {
    if (v === 0) return "-";
    return formatValue(v) + "%";
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

function newInputDate(label, value, name) {
    const l = document.createElement("label");
    const input = document.createElement("input");
    input.className = name;
    input.placeholder = label;
    input.value = value ?? "";
    flatpickr(input, flatpickrOptions);
    l.innerHTML += label + "<br />";
    l.appendChild(input);
    return l;
}

function newInputSelect(label, value, name, options) {
    const l = document.createElement("label");
    const input = document.createElement("select");
    input.className = name;
    input.placeholder = label;
    for (const o of options) {
        input.options.add(new Option(o.name, o.id));
    }
    input.value = value ?? "";
    l.innerHTML += label + "<br />";
    l.appendChild(input);
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
