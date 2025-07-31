output "github_ci_access_key_id" {
  value     = module.ecr.github_ci_access_key_id
  description = "Use as AWS_ACCESS_KEY_ID"
  sensitive = true
}

output "github_ci_secret_access_key" {
  value       = module.ecr.github_ci_secret_access_key
  description = "Use as AWS_SECRET_ACCESS_KEY"
  sensitive   = true
}

