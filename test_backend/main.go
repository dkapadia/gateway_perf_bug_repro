package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func pong(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(w, "pong\n")
}

func main() {
	http.HandleFunc("/ping", pong)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8090"
	}

	log.Printf("Listening on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
