resource "aws_iam_policy" "ecr_push_policy" {
  name   = "ECRPushPolicy"
  path   = "/"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user" "github_ci_user" {
  name = "github-actions-ci"
  tags = {
    project = "ragdoll"
  }
}

resource "aws_iam_user_policy_attachment" "ecr_ci_user_attach" {
  user       = aws_iam_user.github_ci_user.name
  policy_arn = aws_iam_policy.ecr_push_policy.arn
}

resource "aws_iam_access_key" "github_ci_user_key" {
  user = aws_iam_user.github_ci_user.name
}

