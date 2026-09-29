package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"signal"
	"syscall"
)

func main(){
	sign, stop := signal.NotifyContext(context.Background(),os.Interrupt,syscall.SIGTERM)
	defer stop();

	fmt.Println("Signal received", sign)

	application, err := app.New()
	if err != nil{
		fmt.Println("Failed to initialize the application", err)
	}

	if err :=application.Run(); err != nil{
		fmt.Println("Failed to start the server", err)
	}
}