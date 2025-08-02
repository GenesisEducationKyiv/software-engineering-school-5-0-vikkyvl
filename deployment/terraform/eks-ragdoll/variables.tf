variable "public_access_cidrs" {
  description = "List of CIDRs allowed to access EKS API (e.g. ['1.2.3.4/32', '5.6.7.8/32'])"
  type        = list(string)
}

variable "cloudflare_appropriate_email" {
  description = "List of email domains allowed to access Cloudflare applications (e.g. ['mail.example.com'])"
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

# Cloudflare
variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type = string
}

variable "cloudflare_tunnel_hostname" {
  description = "FQDN to expose ingress through tunnel (e.g. myapp.ragdoll.dev)"
  type = string
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token with permissions to manage tunnels and DNS"
  sensitive   = true
}

variable "cloudflare_enable_tunnel" {
  type    = bool
  default = false
}
