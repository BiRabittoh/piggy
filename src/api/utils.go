package api

import (
	"encoding/json"
	"log"
	"net/http"
)

type APIError struct {
	Error string `json:"error"`
}

func jsonResponse(w http.ResponseWriter, v any) {
	w.Header().Add("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(v)
	if err != nil {
		log.Println("could not encode JSON response: " + err.Error())
	}
}

func new500Error(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func new400Error(w http.ResponseWriter, err error) {
	http.Error(w, err.Error(), http.StatusBadRequest)
}
