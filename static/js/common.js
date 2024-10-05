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

function fixDate(date) {
    date.toISOString().split('T')[0]
}

async function myFetch(url) {
    res = await fetch(url);
    if (!res.ok) {
        console.error(res.text())
        return
    }

    return await res.json();
}

async function getRecords() {
    return await myFetch('/api/records');
}
