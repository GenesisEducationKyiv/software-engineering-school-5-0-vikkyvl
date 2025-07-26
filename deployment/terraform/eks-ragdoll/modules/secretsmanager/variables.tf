# Platform
variable "WEATHER_API_KEY" {
  description = "API key for WeatherAPI"
  type        = string
}

variable "OPEN_WEATHER_MAP_KEY" {
  description = "API key for OpenWeatherMap"
  type        = string
}

variable "WEATHER_STACK_KEY" {
  description = "API key for WeatherStack"
  type        = string
}

variable "DB_PASSWORD" {
  description = "Password for PostgreSQL DB"
  type        = string
}

variable "EMAIL_USER" {
  description = "SMTP Email user"
  type        = string
}

variable "EMAIL_PASSWORD" {
  description = "SMTP Email password"
  type        = string
}

# RabbitMQ
variable "RABBITMQ_DEFAULT_USER" {
  description = "RabbitMQ default user"
  type        = string
}

variable "RABBITMQ_DEFAULT_PASS" {
  description = "RabbitMQ default password"
  type        = string
}

# PostgreSQL
variable "POSTGRES_USER" {
  description = "PostgreSQL username"
  type        = string
}

variable "POSTGRES_PASSWORD" {
  description = "PostgreSQL password"
  type        = string
}

variable "POSTGRES_DB" {
  description = "PostgreSQL database name"
  type        = string
}

variable "tags" {
  description = "Tags to apply to the ECR repositories"
  type        = map(string)
  default     = {}
}