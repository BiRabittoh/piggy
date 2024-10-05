document.addEventListener('DOMContentLoaded', function () {
    loadRecords();

    document.getElementById('new-record').addEventListener('click', function () {
        createNewRecord();
    });
});

const casino = {
    type: 'Arbitraggio',
    description: 'Prova',
    date: fixDate(new Date()),
    entries: [
        {
            bookmaker_id: 1,
            account_id: 1,
            amount: 97500,
            refund: 0,
            bonus: 0,
            commission: 0,
            sub_entries: [
                {
                    description: "Punta",
                    odds: 200,
                    won: false,
                }
            ]
        },
        {
            bookmaker_id: 2,
            account_id: 2,
            amount: 100000,
            refund: 0,
            bonus: 0,
            commission: 0,
            sub_entries: [
                {
                    description: "Banca",
                    odds: 195,
                    won: true,
                }
            ]
        },
    ]
};

const bank = {
    type: 'Bancata',
    description: 'Prova',
    date: fixDate(new Date()),
    entries: [
        {
            bookmaker_id: 1,
            account_id: 1,
            amount: 3000,
            refund: 0,
            bonus: 0,
            commission: 0,
            sub_entries: [
                {
                    description: "Punta",
                    odds: 133,
                    won: true,
                }
            ]
        },
        {
            bookmaker_id: 3,
            account_id: 2,
            amount: 3057,
            refund: 0,
            bonus: 0,
            commission: 450,
            sub_entries: [
                {
                    description: "Banca",
                    odds: 135,
                    won: false,
                }
            ]
        },
    ]
};

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

                const fields = [
                    formatDate(record.created_at),
                    record.done,
                    record.type,
                    record.description,
                    formatDate(record.date),
                    formatCash(record.value),
                ];

                for (const field of fields) {
                    const td = document.createElement('td');
                    td.innerText = field;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        });
}



function createNewRecord() {
    const recordStr = JSON.stringify(casino);
    console.log(recordStr);

    fetch('/api/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: recordStr
    }).then(response => response.json())
        .then(() => loadRecords());
}
