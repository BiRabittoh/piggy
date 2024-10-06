package api

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/BiRabittoh/piggy/src/app"
	"gorm.io/gorm"
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

func getBookmakersId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	var bookmaker app.Bookmaker
	err = app.DB.First(&bookmaker, id).Error
	if err != nil {
		log.Println("could not get bookmaker: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, bookmaker)
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

func deleteBookmakersId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	err = app.DB.Delete(&app.Bookmaker{}, id).Error
	if err != nil {
		log.Println("could not delete bookmaker: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, []uint{id})
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

func getAccountsId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	var account app.Account
	err = app.DB.First(&account, id).Error
	if err != nil {
		log.Println("could not get account: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, account)
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

func deleteAccountsId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	err = app.DB.Delete(&app.Account{}, id).Error
	if err != nil {
		log.Println("could not delete account: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, []uint{id})
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
	err = app.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&record).Error
	if err != nil {
		log.Println("could not save record: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, record)
}

func deleteRecordsId(w http.ResponseWriter, r *http.Request) {
	id, err := getId(r)
	if err != nil {
		new400Error(w, err)
		return
	}

	err = app.DB.Delete(&app.Record{}, id).Error
	if err != nil {
		log.Println("could not delete account: " + err.Error())
		new500Error(w, err)
		return
	}

	jsonResponse(w, []uint{id})
}
