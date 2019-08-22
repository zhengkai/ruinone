package main

func main() {

	register()

	theLock := make(chan bool)
	<-theLock

	// time.Sleep(10 * 365 * 86400 * time.Second)
}

func fibonacci(n int) int {
	if n < 2 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}
