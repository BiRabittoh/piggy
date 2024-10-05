package app

import (
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

	Bookmaker  Bookmaker  `json:"bookmaker" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Account    Account    `json:"account" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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
