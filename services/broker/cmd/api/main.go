package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func main(){
	sign, _ := signal.NotifyContext(context.Background(),os.Interrupt,syscall.SIGINT)

	fmt.Println(sign)
}