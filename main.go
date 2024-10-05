package main

import (
	"github.com/BiRabittoh/piggy/src/api"
	"github.com/BiRabittoh/piggy/src/app"
)

func main() {
	app.InitDB()
	api.ListenAndServe()
}
