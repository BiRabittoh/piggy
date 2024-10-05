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
	http.HandleFunc("POST /api/bookmakers", postBookmakers)

	http.HandleFunc("GET /api/accounts", getAccounts)
	http.HandleFunc("POST /api/accounts", postAccounts)

	http.HandleFunc("GET /api/records", getRecords)
	http.HandleFunc("POST /api/records", postRecords)

	log.Println("Serving at " + address + "...")
	log.Fatal(http.ListenAndServe(address, nil))
}
