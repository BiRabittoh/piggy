package app

var ExchangeIDs []uint

func IndexOf[T comparable](slice []T, element T) int {
	for i, el := range slice {
		if el == element {
			return i
		}
	}
	return -1
}

func Contains[T comparable](slice []T, element T) bool {
	return IndexOf(slice, element) != -1
}

func IsExchange(bookmakerID uint) bool {
	return Contains(ExchangeIDs, bookmakerID)
}
