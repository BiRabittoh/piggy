package app

import (
	"log"
	"time"
)

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
	err = DB.Preload("Entries.Bookmaker").Preload("Entries.Account").Preload("Entries.SubEntries").Find(&records).Error
	if err != nil {
		return
	}

	records, total = FillRecordValues(records)
	return
}

func GetRecord(id uint) (record Record, err error) {
	err = DB.Preload("Entries.SubEntries").First(&record, id).Error
	if err != nil {
		return
	}

	records, _ := FillRecordValues([]Record{record})
	return records[0], nil
}
