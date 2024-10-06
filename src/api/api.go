package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/BiRabittoh/piggy/src/app"
)

func getBookmakers(w http.ResponseWriter, r *http.Request) {
	var bookmakers []app.Bookmaker
	err := app.DB.Find(&bookmakers).Error
	if err != nil {
		log.Println("could not get bookmakers: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, bookmakers)
}

func postBookmakers(w http.ResponseWriter, r *http.Request) {
	var bookmaker app.Bookmaker
	err := json.NewDecoder(r.Body).Decode(&bookmaker)
	if err != nil {
		log.Println("could not decode bookmaker JSON: " + err.Error())
		new400Error(w, err)
		return
	}
	err = app.DB.Save(&bookmaker).Error
	if err != nil {
		log.Println("could not save bookmaker: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, bookmaker)
}

func getAccounts(w http.ResponseWriter, r *http.Request) {
	var accounts []app.Account
	err := app.DB.Find(&accounts).Error
	if err != nil {
		log.Println("could not get accounts: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, accounts)
}

func postAccounts(w http.ResponseWriter, r *http.Request) {
	var account app.Account
	err := json.NewDecoder(r.Body).Decode(&account)
	if err != nil {
		log.Println("could not decode account JSON: " + err.Error())
		new400Error(w, err)
		return
	}
	err = app.DB.Save(&account).Error
	if err != nil {
		log.Println("could not save account: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, account)
}

func getRecords(w http.ResponseWriter, r *http.Request) {
	records, _, err := app.GetRecords()
	if err != nil {
		log.Println("could not get records: " + err.Error())
		new500Error(w, err)
	}

	jsonResponse(w, records)
}

func getRecordsId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	record, err := app.GetRecord(id)
	if err != nil {
		log.Println("could not get record: " + err.Error())
		new500Error(w, err)
	}

	jsonResponse(w, record)
}

func postRecords(w http.ResponseWriter, r *http.Request) {
	var record app.Record
	err := json.NewDecoder(r.Body).Decode(&record)
	if err != nil {
		log.Println("could not decode record JSON: " + err.Error())
		new400Error(w, err)
		return
	}
	err = app.DB.Save(&record).Error
	if err != nil {
		log.Println("could not save record: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, record)
}
