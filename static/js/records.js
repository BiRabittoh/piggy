document.addEventListener('DOMContentLoaded', function () {
    loadRecords();

    document.getElementById('new-record').addEventListener('click', editRecord);
});

function editRecord() {
    const out = "/records/edit/";
    const id = this.getAttribute("data-id");
    if (id) {
        out += "?id=" + id;
    }
    location.href = out;
}

function loadRecords() {
    getRecords().then(records => {
            const header = document.getElementById('records-header');
            const table = document.getElementById('records-table');
            header.innerHTML = '';
            table.innerHTML = '';

            const tr = document.createElement('tr');
            const headers = ["Created", "Done", "Type", "Description", "Date", "Value"];

            for (const header of headers) {
                const td = document.createElement('td');
                td.innerText = header;
                tr.appendChild(td);
            }
            header.appendChild(tr);

            for (const record of records) {
                const tr = document.createElement('tr');
                tr.setAttribute("data-id", record.id);
                tr.onclick = editRecord;

                const fields = [
                    formatDate(record.created_at),
                    formatDone(record.done, record.id),
                    record.type,
                    record.description,
                    formatDate(record.date),
                    formatCash(record.value),
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
