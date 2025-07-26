variable "cluster_version" {
  default = "1.33"
}

variable "desired_capacity" {
  default = 1
}

variable "max_size" {
  default = 2
}

variable "min_size" {
  default = 1
}

variable "instance_type" {
  default = "t3.small"
}

variable "capacity_type" {
  default = "SPOT"
}

variable "disk_size" {
  default = 20
}

variable "ami_type" {
  default = "AL2023_x86_64_STANDARD"
}

variable "instance_release_version" {
  default = "1.33.0-20250715"
}

variable "public_access_cidrs" {
  description = "List of CIDRs allowed to access EKS API (e.g. ['1.2.3.4/32', '5.6.7.8/32'])"
  type        = list(string)
}

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

