output "platform_repo_url" {
  value = aws_ecr_repository.platform.repository_url
}

output "platform_web_repo_url" {
  value = aws_ecr_repository.platform_web.repository_url
}

output "github_ci_access_key_id" {
  value       = aws_iam_access_key.github_ci_user_key.id
  description = "Use as AWS_ACCESS_KEY_ID"
  sensitive   = true
}

output "github_ci_secret_access_key" {
  value       = aws_iam_access_key.github_ci_user_key.secret
  description = "Use as AWS_SECRET_ACCESS_KEY"
  sensitive   = true
}
