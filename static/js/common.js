document.addEventListener('DOMContentLoaded', function () {
    const navObject = document.getElementsByTagName("nav")[0];
    for (const page of navPages) {
        const a = document.createElement("a");
        a.innerText = page.name;
        a.href = page.href;
        navObject.appendChild(a)
    }
});

const navPages = [
    { name: "Home", href: "/" },
    { name: "Bookmakers", href: "/bookmakers" },
    { name: "Accounts", href: "/accounts" },
    { name: "Records", href: "/records" },
];

const currency = "€";
const locale = "it-IT";

function formatValue(v) {
    return (v / 100).toFixed(2);
}

function formatCash(v) {
    return formatValue(v) + currency;
}

function formatDate(dateString) {
    return (new Date(dateString)).toLocaleString(locale);
}

function formatDone(value, id) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = value;
    input.disabled = true;
    //input.setAttribute("data-id", id);
    //input.onchange = undefined;
    return input.outerHTML;
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

async function getRecords() {
    return await myFetch('/api/records');
}
