package app

func IndexOf[T comparable](slice []T, element T) int {
	for i, el := range slice {
		if el == element {
			return i
		}
	}
	return -1
}

func (b Bookmaker) IsExchange() bool {
	return b.DefaultCommission != 0
}
