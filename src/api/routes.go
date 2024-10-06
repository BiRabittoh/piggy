package api

import (
	"log"
	"net/http"

	"github.com/BiRabittoh/piggy/src/app"
)

const address = ":3000"

func ListenAndServe() {
	app.InitDB()

	http.Handle("GET /", http.FileServer(http.Dir("static")))

	http.HandleFunc("GET /api/bookmakers", getBookmakers)
	http.HandleFunc("GET /api/bookmakers/{id}", getBookmakersId)
	http.HandleFunc("POST /api/bookmakers", postBookmakers)
	http.HandleFunc("DELETE /api/bookmakers/{id}", deleteBookmakersId)

	http.HandleFunc("GET /api/accounts", getAccounts)
	http.HandleFunc("GET /api/accounts/{id}", getAccountsId)
	http.HandleFunc("POST /api/accounts", postAccounts)
	http.HandleFunc("DELETE /api/accounts/{id}", deleteAccountsId)

	http.HandleFunc("GET /api/records", getRecords)
	http.HandleFunc("GET /api/records/{id}", getRecordsId)
	http.HandleFunc("POST /api/records", postRecords)
	http.HandleFunc("DELETE /api/records/{id}", deleteRecordsId)

	log.Println("Serving at " + address + "...")
	log.Fatal(http.ListenAndServe(address, nil))
}
