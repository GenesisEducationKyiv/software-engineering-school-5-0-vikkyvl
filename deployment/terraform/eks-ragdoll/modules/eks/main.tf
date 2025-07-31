resource "aws_eks_cluster" "main" {
  name     = "ragdoll-eks"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids = aws_subnet.public[*].id
    endpoint_public_access  = true
    endpoint_private_access = true

    public_access_cidrs     = var.public_access_cidrs
  }

  tags = var.tags

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy
  ]
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  url             = aws_eks_cluster.main.identity[0].oidc[0].issuer
}
