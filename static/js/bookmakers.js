document.addEventListener('DOMContentLoaded', function () {
    loadBookmakers();

    document.getElementById('new-bookmaker').addEventListener('click', editBookmaker);
});

function editBookmaker() {
    let out = "/bookmakers/edit/";
    const id = this.getAttribute("data-id");
    if (id) {
        out += "?id=" + id;
    }
    location.href = out;
}

function loadBookmakers() {
    getBookmakers().then(bookmakers => {
            const header = document.getElementById('bookmakers-header');
            const table = document.getElementById('bookmakers-table');
            header.innerHTML = '';
            table.innerHTML = '';

            const tr = document.createElement('tr');
            const headers = ["ID", "Created", "Updated", "Name", "Commission"];

            for (const header of headers) {
                const td = document.createElement('td');
                td.innerText = header;
                tr.appendChild(td);
            }
            header.appendChild(tr);

            for (const bookmaker of bookmakers) {
                const tr = document.createElement('tr');
                tr.setAttribute("data-id", bookmaker.id);
                tr.onclick = editBookmaker;

                const fields = [
                    bookmaker.id,
                    formatDate(bookmaker.created_at),
                    formatDate(bookmaker.updated_at),
                    bookmaker.name,
                    bookmaker.default_commission,
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
