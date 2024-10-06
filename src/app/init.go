package app

import (
	"log"
	"os"
	"path"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

const (
	dbDir        = "data"
	sqliteSuffix = "?_pragma=foreign_keys(1)"
)

var DB *gorm.DB

func InitDB() {
	err := os.MkdirAll(dbDir, os.ModePerm)
	if err != nil {
		log.Println(err) // do not return here
	}

	dsn := path.Join(dbDir, "data.sqlite") + sqliteSuffix

	DB, err = gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Migrate schema
	err = DB.AutoMigrate(&Bookmaker{}, &Account{}, &Record{}, &Entry{}, &SubEntry{})
	if err != nil {
		log.Fatal(err)
	}

	var bookmakersAmount int64
	err = DB.Model(&Bookmaker{}).Count(&bookmakersAmount).Error
	if err != nil {
		log.Println("could not count bookmakers: " + err.Error())
	}
	if bookmakersAmount == 0 {
		InsertSampleData()
	}

	err = DB.Model(&Bookmaker{}).Where("default_commission > 0").Pluck("id", &ExchangeIDs).Error
	if err != nil {
		log.Println("could not get exchange ids: " + err.Error())
	}
}

func InsertSampleData() {
	err := DB.Create(&Bookmaker{Name: "First Bookmaker"}).Error
	if err != nil {
		log.Fatal(err)
	}
	err = DB.Create(&Bookmaker{Name: "Second Bookmaker"}).Error
	if err != nil {
		log.Fatal(err)
	}
	err = DB.Create(&Bookmaker{Name: "Third Exchange", DefaultCommission: 450}).Error
	if err != nil {
		log.Fatal(err)
	}

	err = DB.Create(&Account{Name: "First Account"}).Error
	if err != nil {
		log.Fatal(err)
	}
	err = DB.Create(&Account{Name: "Second Account"}).Error
	if err != nil {
		log.Fatal(err)
	}
}
