package config

import (
	"errors"
	"os"
)

type EnvConfig struct{
	DB_URL string
}

func Load() (*EnvConfig,error) {
	db_url := os.Getenv("DB_URL")
	
	cfg := &EnvConfig{
		DB_URL: db_url,
	}

	if err := validate_env(cfg); err != nil{
		return nil, err
	}

	return cfg, nil
}

func validate_env(cfg *EnvConfig) error {
	if cfg.DB_URL == "" {
		return errors.New("Failed to load env")
	}
}