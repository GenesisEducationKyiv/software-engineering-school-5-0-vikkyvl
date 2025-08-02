variable "cluster_version" {
  default = "1.33"
}

variable "public_access_cidrs" {
  description = "List of CIDRs allowed to access EKS API (e.g. ['1.2.3.4/32', '5.6.7.8/32'])"
  type        = list(string)
}

variable "cloudflare_appropriate_email" {
  description = "List of email domains allowed to access Cloudflare applications (e.g. ['mail.example.com'])"
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to the ECR repositories"
  type        = map(string)
  default     = {}
}

variable "desired_capacity" {
  default = 3
}

variable "max_size" {
  default = 4
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

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID"
  type = string
}

variable "cloudflare_tunnel_hostname" {
  description = "FQDN to expose ingress through tunnel (e.g. myapp.dev)"
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
