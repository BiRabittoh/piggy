package app

import (
	"log"
	"time"
)

type Bookmaker struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Name              string `json:"name" gorm:"not null" `
	Exchange          bool   `json:"exchange" gorm:"not null" `
	DefaultCommission uint   `json:"default_commission" gorm:"not null"`
}

type Account struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`

	Name string `json:"name" gorm:"not null"`
}

type Record struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Done        bool   `json:"done" gorm:"not null"`
	Type        string `json:"type" gorm:"not null"`
	Description string `json:"description" gorm:"not null"`

	Date  *time.Time `json:"date" gorm:"-"`
	Value *int       `json:"value" gorm:"-"`

	Entries []Entry `json:"entries" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type Entry struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	RecordID    uint `json:"record_id" gorm:"not null"`
	BookmakerID uint `json:"bookmaker_id" gorm:"not null"`
	AccountID   uint `json:"account_id" gorm:"not null"`
	Amount      uint `json:"amount" gorm:"not null"`     // In cents (ex: 100 = 1.00)
	Refund      uint `json:"refund" gorm:"not null"`     // In cents (ex: 100 = 1.00)
	Bonus       uint `json:"bonus" gorm:"not null"`      // In cents (ex: 50 = 0.50)
	Commission  uint `json:"commission" gorm:"not null"` // In cents (ex: 4.5% = 450)

	Odds  *uint      `json:"odds" gorm:"-"`
	Won   *bool      `json:"won" gorm:"-"`
	Date  *time.Time `json:"date" gorm:"-"`
	Value *int       `json:"value" gorm:"-"`

	SubEntries []SubEntry `json:"sub_entries" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type SubEntry struct {
	ID        uint      `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	EntryID     uint      `json:"entry_id" gorm:"not null"`
	Description string    `json:"description" gorm:"not null"`
	Odds        uint      `json:"odds" gorm:"not null"` // In cents (ex: 200 = 2.00)
	Won         bool      `json:"won" gorm:"not null"`
	Date        time.Time `json:"date" gorm:"not null;default:current_timestamp"`

	Value *int `json:"value" gorm:"-"`
}

func (e *Entry) GetOdds() *uint {
	v := uint(1)
	for _, s := range e.SubEntries {
		v *= s.Odds
	}
	return &v
}

func (e *Entry) DidWin() *bool {
	v := true
	for _, s := range e.SubEntries {
		if !s.Won {
			v = false
			return &v
		}
	}
	return &v
}

func (e *Entry) GetDate() *time.Time {
	if len(e.SubEntries) == 0 {
		return nil
	}

	last := e.SubEntries[0].Date
	for _, s := range e.SubEntries {
		if s.Date.After(last) {
			last = s.Date
		}
	}
	return &last
}

func (e *Entry) GetValue() (value int) {
	if e.Won == nil || e.Odds == nil {
		log.Fatalf("please, update e.Won and e.Odds first")
	}

	if IsExchange(e.BookmakerID) {
		r := (int(e.Amount) * (int(*e.Odds) - 100)) / 100
		if *e.Won {
			value = int(e.Amount) - int(e.Amount)*int(e.Commission)/10000
		} else {
			value = int(e.Refund) - r
		}
	} else {
		if *e.Won {
			value = (int(e.Amount) * int(*e.Odds) / 100) - int(e.Amount)
		} else {
			value = -int(e.Amount) + int(e.Refund)
		}
	}

	value += int(e.Bonus)
	return
}

func (r *Record) GetDate() *time.Time {
	if len(r.Entries) == 0 {
		return nil
	}

	last := *r.Entries[0].Date
	for _, e := range r.Entries {
		if e.Date.After(last) {
			last = *e.Date
		}
	}
	return &last
}

func FillEntryValues(entries []Entry) ([]Entry, int) {
	var total int
	for i := range entries {
		entries[i].Odds = entries[i].GetOdds()
		entries[i].Won = entries[i].DidWin()
		entries[i].Date = entries[i].GetDate()
		v := entries[i].GetValue()
		entries[i].Value = &v
		total += v
	}
	return entries, total
}

func FillRecordValues(records []Record) ([]Record, int) {
	var total int
	for i := range records {
		_, v := FillEntryValues(records[i].Entries)
		records[i].Date = records[i].GetDate()
		records[i].Value = &v
		total += v
	}
	return records, total
}

func GetRecords() (records []Record, total int, err error) {
	err = DB.Preload("Entries.SubEntries").Find(&records).Error
	if err != nil {
		return
	}

	records, total = FillRecordValues(records)
	return
}
