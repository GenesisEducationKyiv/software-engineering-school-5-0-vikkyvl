variable "platform_repo_name" {
  description = "Name for the platform ECR repository"
  type        = string
}

variable "platform_web_repo_name" {
  description = "Name for the platform-web ECR repository"
  type        = string
}

variable "tags" {
  description = "Tags to apply to the ECR repositories"
  type        = map(string)
  default     = {}
}
