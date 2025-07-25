resource "aws_eks_node_group" "default" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "ragdoll-node-group"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = aws_subnet.public[*].id

  release_version = var.instance_release_version

  scaling_config {
    desired_size = var.desired_capacity
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = [var.instance_type]
  capacity_type = var.capacity_type
  disk_size = var.disk_size
  ami_type = var.ami_type

  tags = local.tags

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEBSCSIDriverPolicy,
    aws_iam_role_policy_attachment.node_ssm
  ]
}
