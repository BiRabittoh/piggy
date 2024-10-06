document.addEventListener('DOMContentLoaded', function () {
    loadAccounts();

    document.getElementById('new-account').addEventListener('click', editAccount);
});

function editAccount() {
    let out = "/accounts/edit/";
    const id = this.getAttribute("data-id");
    if (id) {
        out += "?id=" + id;
    }
    location.href = out;
}

function loadAccounts() {
    getAccounts().then(accounts => {
            const header = document.getElementById('accounts-header');
            const table = document.getElementById('accounts-table');
            header.innerHTML = '';
            table.innerHTML = '';

            const tr = document.createElement('tr');
            const headers = ["ID", "Created", "Updated", "Name"];

            for (const header of headers) {
                const td = document.createElement('td');
                td.innerText = header;
                tr.appendChild(td);
            }
            header.appendChild(tr);

            for (const account of accounts) {
                const tr = document.createElement('tr');
                tr.setAttribute("data-id", account.id);
                tr.onclick = editAccount;

                const fields = [
                    account.id,
                    formatDate(account.created_at),
                    formatDate(account.updated_at),
                    account.name,
                ];

                for (const field of fields) {
                    const td = document.createElement('td');
                    td.innerHTML = field;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        });
}
